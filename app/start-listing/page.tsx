import { PackageSelectForm } from "@/components/IntakeForm/PackageSelectForm";

export const metadata = { title: "Start Your Listing | First Premier MLS Direct" };

export default function StartListingPage({
  searchParams
}: {
  searchParams: { package?: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">
          Start Your Listing
        </h1>
        <p className="mt-4 text-ink/70">
          Pick your package and pay first, Amazon-checkout style. Once payment goes through,
          you'll tell us about your property, upload or schedule photos, and sign your listing
          agreement.
        </p>
      </div>
      <div className="mt-10">
        <PackageSelectForm initialPackageSlug={searchParams.package} />
      </div>
    </section>
  );
}
