import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContactSubmissionForm } from "@/components/IntakeForm/ContactSubmissionForm";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Complete Your Order | First Premier MLS Direct" };

export default async function StartListingDetailsPage({
  searchParams
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;

  if (!orderId) {
    return <MissingOrder reason="We couldn't find an order to continue. Start over below." />;
  }

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return <MissingOrder reason="We couldn't find that order. Start over below." />;
  }

  if (order.payment_status !== "paid") {
    return (
      <MissingOrder reason="Payment hasn't gone through yet for this order. If you already paid, give it a minute and refresh." />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Payment received</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-navy">
          Send Us Your Contact Information
        </h1>
        <p className="mt-4 text-ink/70">
          That's all we need online for now. After you submit this short form, John Duran will
          email the required listing documents and next steps directly from the brokerage.
        </p>
      </div>
      <div className="mt-10">
        <ContactSubmissionForm orderId={order.id} />
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
