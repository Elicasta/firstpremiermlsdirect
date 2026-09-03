export const metadata = {
  title: "Refund Policy | First Premier MLS Direct",
  description: "Refund terms for First Premier MLS Direct flat fee MLS packages and add-on services."
};

export default function RefundPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Customer Policy</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-navy">Refund Policy</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: September 3, 2026</p>

      <div className="mt-8 space-y-8 text-ink/80">
        <div>
          <h2 className="font-display text-xl font-bold text-navy">Overview</h2>
          <p className="mt-2">
            First Premier MLS Direct is a service of First Premier Real Estate Services, Inc.
            This policy explains when payments for flat fee MLS packages and optional add-on
            services may be refunded.
          </p>
        </div>

        <div className="rounded-lg border border-gray bg-gray/60 p-5">
          <h2 className="font-display text-xl font-bold text-navy">Full refund before brokerage work begins</h2>
          <p className="mt-2">
            If you cancel after payment but before the brokerage has begun work on your order,
            you may request a full refund of the MLS package fee. For this policy, brokerage work
            generally begins when John Duran or the brokerage sends your listing documents,
            begins reviewing or preparing listing materials, schedules a package service, or
            otherwise starts performing services for your order.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">After work has begun, before MLS submission</h2>
          <p className="mt-2">
            If you cancel after work has begun but before the property has been submitted to the
            MLS, contact us promptly. Refund eligibility will depend on the work and services
            already performed. Any approved refund may be reduced by completed work or
            non-recoverable third-party or add-on costs already incurred for your order.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">After MLS submission</h2>
          <p className="mt-2">
            Once the brokerage has submitted the property to the MLS, the flat fee MLS package
            fee is non-refundable because the primary listing service has been performed. If an
            error was caused by First Premier Real Estate Services, Inc., the brokerage will work
            to correct the error or provide an appropriate resolution.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">Photography and other add-ons</h2>
          <p className="mt-2">
            Optional services such as photography, drone photography, virtual tours, open house
            materials, and rush processing are refundable only to the extent the service has not
            been scheduled, started, performed, or committed to a third-party provider. Once an
            add-on service has been performed, that portion of the order is non-refundable.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">Duplicate or incorrect charges</h2>
          <p className="mt-2">
            If you believe you were charged twice or charged an incorrect amount, contact us as
            soon as possible. Verified duplicate or erroneous charges will be corrected.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">How to request a refund</h2>
          <p className="mt-2">
            Call <a className="font-semibold text-blue underline" href="tel:3052330447">305-233-0447</a> or
            use our <a className="font-semibold text-blue underline" href="/contact">contact page</a>.
            Include your name, property address, and order ID if available so the brokerage can
            review the request quickly. Approved refunds are returned to the original payment
            method. The time it takes to appear in your account depends on the payment processor
            and your financial institution.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-navy">Applicable law</h2>
          <p className="mt-2">
            Nothing in this policy limits any rights or remedies that cannot legally be waived
            under applicable law.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray pt-6 text-sm text-ink/65">
        <p className="font-display font-bold text-navy">First Premier Real Estate Services, Inc.</p>
        <p>John Duran, Broker</p>
        <p>Broker License 0512688 · Office License CQ1025438</p>
        <p>13265 SW 124 Street, Miami, FL 33186</p>
        <p>305-233-0447</p>
      </div>
    </section>
  );
}
