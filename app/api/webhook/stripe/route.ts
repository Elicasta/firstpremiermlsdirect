import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

// Stripe webhook: payment now happens BEFORE any seller/property info is collected
// (see broker's Amazon-style flow), so at this point we don't have enough to send
// the admin alert or client confirmation emails yet — those need a name and a
// property address, which don't exist until the details step right after this.
// This webhook's only job is to flip payment_status and move the order into
// "awaiting_info" so the details step is unlocked.
//
// It does send one lightweight email of its own: a "resume here" link using the
// email Stripe Checkout collected. Without this, anyone who pays and closes the
// tab before finishing the details step has zero way to find their way back — the
// real confirmation email only fires once seller info exists.
// Configure this endpoint URL in the Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
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
            subject: "Payment received — finish your MLS listing",
            text: `Payment received. Order ID: ${orderId}

Finish your listing here:
${detailsLink}

Thank you,
First Premier MLS Direct
305-233-0447`
          });
        } catch (err) {
          console.error("Resume-listing email failed", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
