import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendAdminAlertEmail, sendClientConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { orderId?: string };
      payment_status?: string;
    };
    const orderId = session.metadata?.orderId;

    if (orderId && session.payment_status === "paid") {
      const supabase = createServiceRoleClient();

      await supabase
        .from("orders")
        .update({ payment_status: "paid", order_status: "awaiting_info" })
        .eq("id", orderId);

      const { data: order } = await supabase
        .from("orders")
        .select("*, sellers(*), properties(*), packages(*)")
        .eq("id", orderId)
        .single();

      // New orders already contain contact/property info before Checkout. Older in-flight
      // test orders may not. Those older orders fall back to the post-payment form and the
      // details endpoint sends the emails once the missing contact data is supplied.
      if (order?.seller_id && order?.property_id) {
        const { data: existingLogs } = await supabase
          .from("email_logs")
          .select("email_type, status")
          .eq("order_id", orderId)
          .in("email_type", ["admin_alert", "client_confirmation"])
          .eq("status", "sent");

        const sentTypes = new Set((existingLogs ?? []).map((row) => row.email_type));

        if (!sentTypes.has("admin_alert")) {
          await sendAdminAlertEmail(order);
        }
        if (!sentTypes.has("client_confirmation")) {
          await sendClientConfirmationEmail(order);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
