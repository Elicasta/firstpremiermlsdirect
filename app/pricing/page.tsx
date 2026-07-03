import { PricingTable } from "@/components/PricingTable";

export const metadata = { title: "Pricing | First Premier MLS Direct" };

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold text-navy">
          Flat Fee MLS Packages Built to Save You Money
        </h1>
        <p className="mt-4 text-ink/70">
          Choose the package that matches how much support you want. Start with basic MLS
          exposure or upgrade for professional photos and broker guidance.
        </p>
      </div>
      <div className="mt-10">
        <PricingTable />
      </div>
    </section>
  );
}
