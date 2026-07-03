export const metadata = { title: "About the Broker | First Premier MLS Direct" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
        About the Broker
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-navy">
        Broker Experience You Can Trust. Flat Fee Pricing Built for Today.
      </h1>

      <div className="mt-6 space-y-4 text-ink/80">
        <p>
          First Premier MLS Direct is led by a licensed Florida real estate broker with more
          than 36 years of experience helping buyers, sellers, and property owners navigate the
          real estate market.
        </p>
        <p>
          After decades in the industry, the mission is simple: help homeowners get the
          exposure they need without giving away more of their equity than necessary.
        </p>
        <p>
          In a market where every dollar matters, First Premier MLS Direct gives sellers a
          practical way to list their property on the MLS, reach buyers, and stay in control of
          the sale.
        </p>
      </div>

      <div className="mt-8 rounded-lg bg-gray p-6">
        <p className="font-display text-lg font-bold text-navy">
          36+ years of real estate experience.
        </p>
        <p className="mt-1 text-ink/70">One simple goal: help Florida sellers save money.</p>
      </div>

      <p className="mt-8 text-sm text-ink/60">
        First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a
        licensed Florida real estate brokerage.
      </p>
    </section>
  );
}
