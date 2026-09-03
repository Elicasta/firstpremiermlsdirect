import Link from "next/link";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata = { title: "FAQ | First Premier MLS Direct" };

export default function FAQPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 text-ink/70">
        Questions about cancellations or refunds? Read the full{" "}
        <Link href="/refund-policy" className="font-semibold text-blue underline">
          Refund Policy
        </Link>
        .
      </p>
      <div className="mt-8">
        <FAQAccordion />
      </div>
    </section>
  );
}
