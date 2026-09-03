import { createServiceRoleClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { ContactSubmissionForm } from "@/components/IntakeForm/ContactSubmissionForm";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Payment Received | First Premier MLS Direct" };

export default async function StartListingDetailsPage({
  searchParams
}: {
  searchParams: { order?: string; session_id?: string };
}) {
  const orderId = searchParams.order;
  const sessionId = searchParams.session_id;

  if (!orderId) {
    return <MissingOrder reason="We couldn't find an order to continue. Start over below." />;
  }

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status, stripe_session_id, seller_id, property_id, sellers(first_name), properties(property_address), packages(name)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return <MissingOrder reason="We couldn't find that order. Start over below." />;
  }

  let paymentConfirmed = order.payment_status === "paid";

  // Stripe can redirect a customer before the webhook finishes. Verify the Session
  // server-side so the confirmation page never incorrectly blocks a successful payer.
  // The webhook remains authoritative for updating the database and sending emails.
  if (!paymentConfirmed && sessionId && sessionId === order.stripe_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentConfirmed = session.metadata?.orderId === orderId && session.payment_status === "paid";
    } catch (error) {
      console.error("Unable to verify Stripe Checkout Session on return", error);
    }
  }

  if (!paymentConfirmed) {
    return (
      <MissingOrder reason="We haven't confirmed payment for this order yet. If you just paid, wait a moment and refresh this page. If the problem continues, call 305-233-0447." />
    );
  }

  // Backward compatibility for any older checkout session created before contact info
  // moved ahead of payment. New orders will never need this form.
  if (!order.seller_id || !order.property_id) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Payment received</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-navy">
            Send Us Your Contact Information
          </h1>
          <p className="mt-4 text-ink/70">
            Complete this short form so John Duran can send the required listing documents and next steps.
          </p>
        </div>
        <div className="mt-10">
          <ContactSubmissionForm orderId={order.id} />
        </div>
      </section>
    );
  }

  const sellerRelation = (order as any).sellers;
  const propertyRelation = (order as any).properties;
  const packageRelation = (order as any).packages;
  const seller = Array.isArray(sellerRelation) ? sellerRelation[0] : sellerRelation;
  const property = Array.isArray(propertyRelation) ? propertyRelation[0] : propertyRelation;
  const pkg = Array.isArray(packageRelation) ? packageRelation[0] : packageRelation;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Payment received</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-navy">
          Thank You. John Will Take It From Here.
        </h1>
        <p className="mt-4 text-ink/70">
          Your order is confirmed. We sent a confirmation email, and John Duran will follow up with
          the official brokerage forms and next steps.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-gray bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold">Customer</p>
            <p className="mt-1 font-display text-lg font-bold text-navy">{seller?.first_name || "Customer"}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold">Package</p>
            <p className="mt-1 font-display text-lg font-bold text-navy">{pkg?.name || "MLS Package"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wide text-gold">Property</p>
            <p className="mt-1 text-ink/80">{property?.property_address}</p>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-gray p-4">
          <p className="text-sm font-semibold text-navy">What happens next</p>
          <p className="mt-1 text-sm leading-6 text-ink/70">
            John will email the required listing agreement, property forms, and package-specific
            instructions. You do not need to submit anything else on the website right now.
          </p>
        </div>

        <p className="mt-5 text-xs text-ink/50">
          Order ID: <span className="font-semibold text-navy">{orderId}</span>
        </p>

        <div className="mt-6">
          <ButtonLink href="/" variant="primary">Return Home</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function MissingOrder({ reason }: { reason: string }) {
  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold text-navy">We hit a snag</h1>
      <p className="mt-4 text-ink/70">{reason}</p>
      <div className="mt-6">
        <ButtonLink href="/start-listing" variant="primary">
          Start My Listing
        </ButtonLink>
      </div>
    </section>
  );
}
