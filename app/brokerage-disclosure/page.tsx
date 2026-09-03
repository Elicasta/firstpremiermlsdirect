export const metadata = { title: "Brokerage Disclosure | First Premier MLS Direct" };

export default function BrokerageDisclosurePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Brokerage Disclosure</h1>

      <p className="mt-6 text-ink/80">
        First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a
        licensed real estate brokerage in the State of Florida.
      </p>

      <div className="mt-6 rounded-lg bg-gray p-6 text-ink/80">
        <p className="font-display font-bold text-navy">First Premier Real Estate Services, Inc.</p>
        <p className="mt-1">John Duran, Broker</p>
        <p>Broker License 0512688</p>
        <p>Office License CQ1025438</p>
        <p className="mt-2">13265 SW 124 Street</p>
        <p>Miami, FL 33186</p>
        <p>305-233-0447</p>
      </div>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Flat Fee MLS Service</h2>
      <p className="mt-2 text-ink/80">
        Purchasing a package begins the service process but does not replace the required
        brokerage documents. After payment and submission of your contact information, John
        Duran will send the applicable listing agreement, disclosures, property forms, and other
        instructions. The exact brokerage relationship and scope of services are governed by the
        documents you sign, applicable Florida law, and the rules of the applicable MLS.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Scope of Service</h2>
      <p className="mt-2 text-ink/80">
        Flat fee MLS packages are limited-service offerings. Services vary by package and may not
        include every service typically associated with a traditional full-service real estate
        listing. Review the selected package and your brokerage documents carefully so you know
        which responsibilities are handled by you and which are handled by the brokerage.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">MLS Submission</h2>
      <p className="mt-2 text-ink/80">
        A property is not submitted to the MLS solely because a package was purchased. Required
        information, signed documents, photos, and any other items requested by the broker must
        be received and approved before submission.
      </p>

      <h2 className="mt-8 font-display text-xl font-bold text-navy">Questions</h2>
      <p className="mt-2 text-ink/80">
        Call 305-233-0447 if you have questions about the brokerage relationship or the scope of
        a package before purchasing.
      </p>
    </section>
  );
}
