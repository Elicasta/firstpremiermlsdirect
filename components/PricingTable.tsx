import { PACKAGES, ADDONS } from "@/lib/packages";
import { PackageCard } from "./PackageCard";

export function PricingTable() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} />
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-gray p-6">
        <h3 className="font-display text-lg font-extrabold text-navy">Add-Ons</h3>
        <p className="mt-1 text-sm text-ink/70">Available on any package.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ADDONS.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center justify-between rounded-md bg-white px-4 py-3 text-sm"
            >
              <span>{addon.name}</span>
              <span className="font-display font-bold text-navy">
                {addon.startingAt ? "Starting at " : "+"}${addon.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
