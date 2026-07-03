"use client";

import { Package } from "@/lib/types";

export function ReviewStep({
  pkg,
  seller,
  property,
  addons
}: {
  pkg: Package;
  seller: { firstName: string; lastName: string; email: string; phone: string };
  property: { propertyAddress: string; city: string; state: string; zip: string; desiredListingPrice: string };
  addons: string[];
}) {
  return (
    <div className="space-y-4 rounded-lg bg-gray p-6 text-sm">
      <div>
        <p className="font-display font-bold text-navy">Package</p>
        <p>{pkg.name} — ${pkg.price}</p>
        {addons.length > 0 && <p className="text-ink/70">Add-ons: {addons.join(", ")}</p>}
      </div>
      <div>
        <p className="font-display font-bold text-navy">Seller</p>
        <p>{seller.firstName} {seller.lastName} · {seller.email} · {seller.phone}</p>
      </div>
      <div>
        <p className="font-display font-bold text-navy">Property</p>
        <p>
          {property.propertyAddress}, {property.city}, {property.state} {property.zip}
        </p>
        <p>Listing price: ${property.desiredListingPrice}</p>
      </div>
      <p className="text-xs text-ink/60">
        By continuing, you confirm the information above is accurate. Next you'll upload or
        schedule photos, then sign your listing agreement.
      </p>
    </div>
  );
}
