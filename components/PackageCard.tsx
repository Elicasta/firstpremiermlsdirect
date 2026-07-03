import { Package } from "@/lib/types";
import { ButtonLink } from "./ui/Button";

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border bg-white p-6 shadow-sm ${
        pkg.popular ? "border-red border-2" : "border-gray"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-red px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-white">
          Most Popular
        </span>
      )}

      <p className="font-display text-xs font-bold uppercase tracking-wide text-gold">
        {pkg.positioning}
      </p>
      <h3 className="mt-1 font-display text-xl font-extrabold text-navy">{pkg.name}</h3>
      <p className="mt-2 font-display text-4xl font-extrabold text-red">${pkg.price}</p>
      <p className="mt-2 text-sm text-ink/70">{pkg.description}</p>

      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-0.5 text-blue">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {pkg.excludes && pkg.excludes.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-gray pt-3 text-sm text-ink/50">
          {pkg.excludes.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <ButtonLink
        href={`/start-listing?package=${pkg.slug}`}
        variant={pkg.popular ? "primary" : "secondary"}
        className="mt-6 w-full"
      >
        {pkg.cta}
      </ButtonLink>
    </div>
  );
}
