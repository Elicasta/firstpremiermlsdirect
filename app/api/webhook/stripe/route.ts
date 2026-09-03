import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL, REPLY_TO_EMAIL } from "@/lib/resend";

// Stripe webhook: payment happens before customer contact information is collected.
// Mark the order paid, then send a lightweight resume link to the email Stripe captured.
// John receives the broker alert only after the customer submits the short contact form.
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
      customer_details?: { email?: string | null } | null;
    };
    const orderId = session.metadata?.orderId;
    const customerEmail = session.customer_details?.email;

    if (orderId) {
      const supabase = createServiceRoleClient();
      await supabase
        .from("orders")
        .update({ payment_status: "paid", order_status: "awaiting_info" })
        .eq("id", orderId);

      if (customerEmail) {
        const detailsLink = `${process.env.NEXT_PUBLIC_SITE_URL}/start-listing/details?order=${orderId}`;
        try {
          await getResend().emails.send({
            from: FROM_EMAIL,
            to: customerEmail,
            replyTo: REPLY_TO_EMAIL,
            subject: "Payment received — send us your contact information",
            text: `Payment received. Thank you for choosing First Premier MLS Direct.

Order ID: ${orderId}

Please complete the short contact form here:
${detailsLink}

We only need your name, phone number, email, and property address. After you submit it, John Duran, Broker, will email the official listing forms and next steps directly from First Premier Real Estate Services, Inc.

First Premier MLS Direct
305-233-0447`
          });
        } catch (err) {
          console.error("Post-payment resume email failed", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
