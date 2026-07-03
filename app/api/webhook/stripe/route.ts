import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendClientConfirmationEmail, sendAdminAlertEmail } from "@/lib/email";

// Stripe webhook: on successful checkout, mark the order paid and fire the
// client confirmation + admin alert emails. Configure this endpoint URL in the
// Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
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
    const session = event.data.object as { metadata?: { orderId?: string } };
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const supabase = createServiceRoleClient();

      const { data: order } = await supabase
        .from("orders")
        .update({ payment_status: "paid", order_status: "awaiting_photos" })
        .eq("id", orderId)
        .select("*, sellers(*), properties(*), packages(*)")
        .single();

      if (order) {
        await sendClientConfirmationEmail(order);
        await sendAdminAlertEmail(order);
      }
    }
  }

  return NextResponse.json({ received: true });
}
