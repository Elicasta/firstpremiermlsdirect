"use client";

import { useState } from "react";
import { PACKAGES, ADDONS } from "@/lib/packages";
import { Button } from "../ui/Button";

export function PackageSelectForm({ initialPackageSlug }: { initialPackageSlug?: string }) {
  const [packageSlug, setPackageSlug] = useState(initialPackageSlug ?? "standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pkg = PACKAGES.find((p) => p.slug === packageSlug) ?? PACKAGES[1];
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      // Step 1: a real order row exists before Stripe ever sees this — no seller or
      // property info yet, just a package and a price. This is what makes sure photo
      // uploads and everything downstream always has a real order id to attach to.
      const draftRes = await fetch("/api/orders/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug, selectedAddons })
      });
      if (!draftRes.ok) {
        const body = await draftRes.json().catch(() => ({}));
        throw new Error(body.error || `Failed to start your order (${draftRes.status})`);
      }
      const { orderId } = await draftRes.json();

      // Step 2: pay first, Amazon-checkout style. Details come after.
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, packageSlug, selectedAddons })
      });
      if (!checkoutRes.ok) {
        const body = await checkoutRes.json().catch(() => ({}));
        throw new Error(body.error || `Failed to start checkout (${checkoutRes.status})`);
      }
      const { checkoutUrl } = await checkoutRes.json();

      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`${message} (call 305-233-0447 if this keeps happening)`);
      console.error("Checkout failed:", err);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray bg-white p-6">
        <h2 className="font-display text-xl font-bold text-navy">Choose Your Package</h2>
        <div className="mt-4 grid gap-3">
          {PACKAGES.map((p) => (
            <label
              key={p.slug}
              className={`flex cursor-pointer items-center justify-between rounded-md border p-4 ${
                packageSlug === p.slug ? "border-red bg-red/5" : "border-gray"
              }`}
            >
              <div>
                <p className="font-display font-bold text-navy">{p.name}</p>
                <p className="text-sm text-ink/60">{p.positioning}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-extrabold text-red">${p.price}</span>
                <input
                  type="radio"
                  checked={packageSlug === p.slug}
                  onChange={() => setPackageSlug(p.slug)}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <p className="font-semibold text-navy">Add-ons (optional)</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ADDONS.map((addon) => (
              <label key={addon.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={(e) =>
                    setSelectedAddons((prev) =>
                      e.target.checked ? [...prev, addon.id] : prev.filter((a) => a !== addon.id)
                    )
                  }
                />
                {addon.name} (+${addon.price})
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-md bg-gray p-4">
          <span className="font-display font-bold text-navy">Total due today</span>
          <span className="font-display text-2xl font-extrabold text-red">
            ${pkg.price + addonTotal}
          </span>
        </div>

        {error && <p className="mt-4 text-sm text-red">{error}</p>}

        <Button className="mt-6 w-full" onClick={handleCheckout} disabled={loading} showArrow>
          {loading ? "Starting checkout..." : "Continue to Payment"}
        </Button>

        <p className="mt-3 text-center text-xs text-ink/50">
          You'll pay first, then tell us about your property. Takes about 2 minutes after
          payment.
        </p>
      </div>
    </div>
  );
}
