export const metadata = { title: "Brokerage Disclosure | First Premier MLS Direct" };

export default function BrokerageDisclosurePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16 prose prose-sm max-w-none">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Brokerage Disclosure</h1>

      <p className="mt-6 text-ink/80">
        First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a
        licensed real estate brokerage in the State of Florida.
      </p>

      <div className="mt-6 rounded-lg bg-gray p-6 text-ink/80">
        <p className="font-display font-bold text-navy">First Premier Real Estate Services, Inc.</p>
        <p>Licensed Florida Real Estate Brokerage</p>
        <p>13265 SW 124 Street</p>
        <p>Miami, FL 33186</p>
        <p>305-233-0447</p>
      </div>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Role of the Brokerage</h2>
      <p className="mt-2 text-ink/80">
        When you purchase a flat fee MLS listing package, First Premier Real Estate Services,
        Inc. acts as the listing broker of record for purposes of entering your property into
        the MLS. This is a limited-service arrangement: the brokerage handles MLS entry, listing
        review, and compliance with MLS rules. It does not include the full scope of services a
        traditional full-service listing agent provides, such as negotiating offers on your
        behalf, hosting open houses, or representing you at closing, unless you separately
        arrange for those services.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">No Dual Agency by Default</h2>
      <p className="mt-2 text-ink/80">
        First Premier Real Estate Services, Inc. does not automatically represent buyers who
        inquire about your listing. If a buyer works with their own agent, that agent
        represents the buyer, not you or the brokerage.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Advertising Compliance</h2>
      <p className="mt-2 text-ink/80">
        In accordance with Florida real estate advertising rules, the licensed brokerage name
        is shown next to or near this brand's contact information throughout the site, so it's
        always clear you're working with a licensed brokerage, not just a listing platform.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Questions</h2>
      <p className="mt-2 text-ink/80">
        Call 305-233-0447 if you have questions about the brokerage relationship before you
        purchase a package.
      </p>
    </section>
  );
}
