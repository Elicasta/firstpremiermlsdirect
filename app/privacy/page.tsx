export const metadata = { title: "Privacy Policy | First Premier MLS Direct" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16 prose prose-sm max-w-none">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Privacy Policy</h1>
      <p className="mt-6 text-ink/80">
        First Premier Real Estate Services, Inc. collects the information you provide during
        the listing intake process, including seller contact details, property information, and
        uploaded photos, in order to prepare and submit your MLS listing.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold text-navy">Information We Collect</h2>
      <p className="mt-2 text-ink/80">
        Name, contact information, property address and details, payment confirmation from
        Stripe, signed agreement status, and uploaded files.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold text-navy">How We Use It</h2>
      <p className="mt-2 text-ink/80">
        To prepare your MLS listing, process payment, send order updates, and provide customer
        support. We do not sell your information.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold text-navy">Third-Party Services</h2>
      <p className="mt-2 text-ink/80">
        We use Stripe for payment processing, Supabase for data storage, Resend for
        transactional email, and an e-signature provider for your listing agreement. Each
        processes data under its own privacy policy.
      </p>
      <h2 className="mt-8 font-display text-xl font-bold text-navy">Contact</h2>
      <p className="mt-2 text-ink/80">
        First Premier Real Estate Services, Inc. — 305-233-0447
      </p>
    </section>
  );
}
