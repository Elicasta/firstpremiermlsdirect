import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "How It Works | First Premier MLS Direct" };

export default function HowItWorksPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">How It Works</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        The online part is intentionally simple. Choose a package, send us your basic contact and
        property information, then pay securely. You will receive a confirmation, and John Duran
        will email the required listing documents and next steps directly from First Premier Real
        Estate Services, Inc.
      </p>

      <div className="mt-10">
        <HowItWorksSteps />
      </div>

      <div className="mt-10 rounded-lg bg-gray p-6">
        <h2 className="font-display text-lg font-extrabold text-navy">
          What happens after payment?
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-ink/75">
          John will send the required listing agreement and property forms directly from the
          brokerage. You will complete those documents with him, and he will collect any photos or
          supporting information needed for the package you selected.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-ink/75">
          Most completed listings are submitted within 48 hours after all required information,
          payment, signed documents, and usable photos are received and approved by the broker.
        </p>
      </div>

      <div className="mt-8">
        <ButtonLink href="/start-listing" variant="primary">
          Start My Listing
        </ButtonLink>
      </div>
    </section>
  );
}
