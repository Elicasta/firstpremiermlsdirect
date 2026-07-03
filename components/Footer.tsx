import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-brand text-lg">First Premier MLS Direct</p>
            <p className="mt-2 text-sm text-white/70">
              First Premier Real Estate Services, Inc.
              <br />
              Licensed Florida Real Estate Brokerage
              <br />
              <a href="tel:3052330447" className="hover:text-gold focus-ring">
                305-233-0447
              </a>
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
              Site
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li><Link href="/pricing" className="hover:text-white focus-ring">Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white focus-ring">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-white focus-ring">About the Broker</Link></li>
              <li><Link href="/faq" className="hover:text-white focus-ring">FAQ</Link></li>
              <li><Link href="/portal" className="hover:text-white focus-ring">Client Portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
              Legal
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li><Link href="/terms" className="hover:text-white focus-ring">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white focus-ring">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white focus-ring">Contact</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-4 text-xs text-white/50">
          &copy; {new Date().getFullYear()} First Premier Real Estate Services, Inc. All rights
          reserved. Equal Housing Opportunity. Flat fee MLS exposure — not a guarantee of sale.
        </p>
      </div>
    </footer>
  );
}
