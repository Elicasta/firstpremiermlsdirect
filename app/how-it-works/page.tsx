import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "How It Works | First Premier MLS Direct" };

export default function HowItWorksPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl font-extrabold text-navy">How It Works</h1>
      <p className="mt-4 max-w-2xl text-ink/70">
        Most completed listings are submitted within 48 hours after all required information,
        payment, signed documents, and usable photos are received.
      </p>
      <div className="mt-10">
        <HowItWorksSteps />
      </div>
      <div className="mt-10 rounded-lg bg-gray p-6">
        <h2 className="font-display text-lg font-extrabold text-navy">
          A listing does not move to MLS submission until:
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink/80">
          <li>• Payment is completed</li>
          <li>• The listing agreement is signed</li>
          <li>• Required seller and property data is complete</li>
          <li>• Photos are uploaded or a photo session is scheduled</li>
          <li>• The broker has approved the submission</li>
        </ul>
      </div>
      <div className="mt-8">
        <ButtonLink href="/start-listing" variant="primary">
          Start My Listing
        </ButtonLink>
      </div>
    </section>
  );
}
