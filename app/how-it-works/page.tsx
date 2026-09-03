import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "How It Works | First Premier MLS Direct" };

export default function HowItWorksPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">How It Works</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        The online part is intentionally simple. Choose a package, pay, and send us your contact
        information. John Duran will then email the required listing documents and next steps
        directly from First Premier Real Estate Services, Inc.
      </p>

      <div className="mt-10">
        <HowItWorksSteps />
      </div>

      <div className="mt-10 rounded-lg bg-gray p-6">
        <h2 className="font-display text-lg font-extrabold text-navy">
          What happens after John contacts you?
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-ink/75">
          You will complete the required listing agreement and property forms directly with the
          brokerage. John will review the information, collect any required photos or supporting
          documents, and prepare the listing for MLS submission.
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
