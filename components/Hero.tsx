import { ButtonLink } from "./ui/Button";

export function Hero() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
            List Your Home on the MLS for a Flat Fee
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Save thousands by getting your property listed through a licensed Florida real
            estate broker without paying a traditional full listing commission.
          </p>
          <p className="mt-4 font-display text-xl font-bold text-gold">
            Packages start at $299.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink href="/start-listing" variant="primary">
              Start My Listing
            </ButtonLink>
            <ButtonLink href="/pricing" variant="ghost" className="border-white text-white hover:bg-white hover:text-navy">
              View Packages
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-6 ring-1 ring-white/10">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
            Same goal. Smarter cost.
          </p>
          <p className="mt-2 text-white/85">
            Same goal: get buyers to see your home.
            <br />
            Smarter cost: flat fee instead of a large listing commission.
          </p>
        </div>
      </div>
    </section>
  );
}
