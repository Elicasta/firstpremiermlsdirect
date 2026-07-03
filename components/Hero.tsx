import Image from "next/image";
import { ShieldCheck, Award, Tag, Camera } from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./Reveal";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Licensed Florida Real Estate Brokerage" },
  { icon: Award, label: "36+ Years of Experience" },
  { icon: Tag, label: "Flat Fee MLS Listing" },
  { icon: Camera, label: "Professional Photo Options Available" }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <Image
        src="/images/hero-home.png"
        alt="Florida home listed with First Premier MLS Direct"
        fill
        priority
        className="object-cover opacity-40"
        sizes="100vw"
      />
      {/* Left-to-right navy gradient keeps headline copy readable over the photo,
          same trick the ad reference uses. */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-24">
        <Reveal className="max-w-2xl">
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            List Your Home on the MLS for a Flat Fee
          </h1>
          <p className="mt-1 font-display text-2xl font-extrabold leading-tight text-gold sm:text-3xl">
            No Traditional Listing Commission
          </p>
          <p className="mt-4 text-base text-white/85 sm:text-lg">
            Save thousands by getting your property listed through a licensed Florida real
            estate broker without paying a traditional full listing commission.
          </p>
          <p className="mt-4 font-display text-xl font-bold text-gold">
            Packages start at $299.
          </p>
          <p className="mt-1 text-xs text-white/60">
            You still choose whether to offer buyer agent compensation. See our FAQ for details.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
            <ButtonLink href="/start-listing" variant="primary">
              Start My Listing
            </ButtonLink>
            <ButtonLink
              href="/pricing"
              variant="ghost"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              View Packages
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={150} as="div" className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-8 sm:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-start gap-2">
              <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" aria-hidden="true" />
              <p className="font-display text-xs font-bold uppercase tracking-wide text-white/90">
                {item.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
