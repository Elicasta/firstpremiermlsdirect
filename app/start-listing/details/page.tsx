import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPackageBySlug } from "@/lib/packages";
import { DetailsWizard } from "@/components/IntakeForm/DetailsWizard";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Complete Your Listing | First Premier MLS Direct" };

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
    .select("id, payment_status, selected_addons, packages(slug)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return <MissingOrder reason="We couldn't find that order. Start over below." />;
  }

  if (order.payment_status !== "paid") {
    return (
      <MissingOrder reason="Payment hasn't gone through yet for this order. If you already paid, give it a minute and refresh — otherwise start over below." />
    );
  }

  const packageSlug = (order.packages as unknown as { slug: string } | null)?.slug ?? "standard";
  const pkg = getPackageBySlug(packageSlug);

  if (!pkg) {
    return <MissingOrder reason="Something's off with this order's package. Call 305-233-0447 and we'll sort it out." />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">
          Payment Received. Let's Finish Your Listing.
        </h1>
        <p className="mt-4 text-ink/70">
          Tell us about your property, upload or schedule photos, and sign your listing
          agreement. Takes about 10 minutes.
        </p>
      </div>
      <div className="mt-10">
        <DetailsWizard orderId={order.id} pkg={pkg} addons={order.selected_addons ?? []} />
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
