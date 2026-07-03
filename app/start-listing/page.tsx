import { IntakeWizard } from "@/components/IntakeForm/IntakeWizard";

export const metadata = { title: "Start Your Listing | First Premier MLS Direct" };

export default function StartListingPage({
  searchParams
}: {
  searchParams: { package?: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-navy">Start Your Listing</h1>
        <p className="mt-4 text-ink/70">
          This takes about 10 minutes. You'll choose your package, tell us about your property,
          sign your agreement, and pay online.
        </p>
      </div>
      <div className="mt-10">
        <IntakeWizard initialPackageSlug={searchParams.package} />
      </div>
    </section>
  );
}
