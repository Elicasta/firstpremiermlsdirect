import Image from "next/image";

export const metadata = { title: "About John Duran | First Premier MLS Direct" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div className="mx-auto w-40 overflow-hidden rounded-lg shadow-md md:w-full">
          <Image
            src="/images/broker-portrait.png"
            alt="John Duran, Broker, First Premier Real Estate Services, Inc."
            width={440}
            height={660}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
            Meet the Broker
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            John Duran
          </h1>
          <p className="mt-2 font-display text-lg font-bold text-blue">
            Broker, First Premier Real Estate Services, Inc.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/60">
            <span>Broker License: 0512688</span>
            <span>Office License: CQ1025438</span>
          </div>

          <div className="mt-6 space-y-4 text-ink/80">
            <p>
              John Duran has more than 36 years of real estate experience helping buyers,
              sellers, and property owners navigate the Florida real estate market.
            </p>
            <p>
              After decades in the industry, his goal with First Premier MLS Direct is simple:
              give homeowners a practical way to get MLS exposure without automatically paying
              a traditional percentage-based listing commission.
            </p>
            <p>
              In an economy where every dollar matters, John believes sellers should have a
              clear, lower-cost option when they are comfortable handling more of the sale
              themselves.
            </p>
          </div>

          <div className="mt-8 rounded-lg bg-gray p-6">
            <p className="font-display text-lg font-bold text-navy">
              36+ years of real estate experience.
            </p>
            <p className="mt-1 text-ink/70">One simple goal: help Florida sellers keep more of their equity.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-gray bg-white p-5 text-sm text-ink/65">
        <p className="font-display font-bold text-navy">Brokerage Information</p>
        <p className="mt-2">
          First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a
          licensed Florida real estate brokerage.
        </p>
        <p className="mt-2">
          John Duran, Broker · Broker License 0512688 · Office License CQ1025438
        </p>
      </div>
    </section>
  );
}
