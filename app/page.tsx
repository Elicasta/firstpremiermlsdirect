import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { PACKAGES } from "@/lib/packages";
import { PackageCard } from "@/components/PackageCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { Award } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Why pay thousands more just to get listed?
          </h2>
          <p className="mt-4 text-ink/80">
            Traditional listing commissions can take a serious bite out of your equity. First
            Premier MLS Direct gives sellers a simple flat-fee option to get MLS exposure while
            staying in control of their sale.
          </p>
        </Reveal>
      </section>

      <section className="bg-gray py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">
              Most completed listings are submitted within 48 hours after all required
              information, payment, signed documents, and usable photos are received.
            </p>
          </Reveal>
          <div className="mt-10">
            <HowItWorksSteps />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Flat Fee MLS Packages
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Choose the package that matches how much support you want.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="bg-navy py-12 text-white md:py-16">
        <Reveal className="mx-auto max-w-4xl px-4 text-center">
          <p className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-gold">
            <Award className="h-4 w-4" aria-hidden="true" />
            36+ Years of Broker Experience
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
            Broker Experience You Can Trust. Flat Fee Pricing Built for Today.
          </h2>
          <p className="mt-4 text-white/80">
            First Premier MLS Direct is led by a licensed Florida real estate broker with more
            than 36 years of experience helping buyers, sellers, and property owners navigate
            the real estate market. The mission is simple: help homeowners get the exposure they
            need without giving away more of their equity than necessary.
          </p>
          <div className="mt-6">
            <ButtonLink
              href="/about"
              variant="ghost"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              Meet the Broker
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
