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

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const contact = {
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      propertyAddress: String(form.get("propertyAddress") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      state: String(form.get("state") ?? "FL").trim(),
      zip: String(form.get("zip") ?? "").trim()
    };

    try {
      // Save the lead before sending them to Stripe. If they leave Checkout without
      // paying, the brokerage still has a real unpaid order tied to their contact info.
      const draftRes = await fetch("/api/orders/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug, selectedAddons, ...contact })
      });
      if (!draftRes.ok) {
        const body = await draftRes.json().catch(() => ({}));
        throw new Error(body.error || `Failed to start your order (${draftRes.status})`);
      }
      const { orderId } = await draftRes.json();

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

  const inputClass = "mt-1 w-full rounded-md border border-gray bg-white px-3 py-2.5 focus-ring";

  return (
    <form onSubmit={handleCheckout} className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-extrabold text-gold">01</span>
          <h2 className="font-display text-xl font-bold text-navy">Choose Your Package</h2>
        </div>

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
                  name="package"
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

        <div className="my-7 border-t border-gray" />

        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-extrabold text-gold">02</span>
          <h2 className="font-display text-xl font-bold text-navy">Your Contact Information</h2>
        </div>
        <p className="mt-2 text-sm text-ink/65">
          We collect this before payment so your order stays connected to you. John will use this
          information to send the official brokerage forms after payment.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-navy">First name</label>
            <input id="firstName" name="firstName" autoComplete="given-name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-navy">Last name</label>
            <input id="lastName" name="lastName" autoComplete="family-name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-navy">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-navy">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required className={inputClass} />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="propertyAddress" className="block text-sm font-semibold text-navy">Property address</label>
          <input id="propertyAddress" name="propertyAddress" autoComplete="street-address" required className={inputClass} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_100px_120px]">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-navy">City</label>
            <input id="city" name="city" autoComplete="address-level2" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-navy">State</label>
            <input id="state" name="state" defaultValue="FL" maxLength={2} autoComplete="address-level1" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="zip" className="block text-sm font-semibold text-navy">ZIP</label>
            <input id="zip" name="zip" inputMode="numeric" autoComplete="postal-code" required className={inputClass} />
          </div>
        </div>

        <div className="my-7 border-t border-gray" />

        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-extrabold text-gold">03</span>
          <h2 className="font-display text-xl font-bold text-navy">Secure Payment</h2>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-md bg-gray p-4">
          <span className="font-display font-bold text-navy">Total due today</span>
          <span className="font-display text-2xl font-extrabold text-red">
            ${pkg.price + addonTotal}
          </span>
        </div>

        {error && <p className="mt-4 text-sm text-red">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading} showArrow>
          {loading ? "Opening secure checkout..." : "Continue to Secure Payment"}
        </Button>

        <p className="mt-3 text-center text-xs text-ink/50">
          Payment is processed securely by Stripe. After payment, John Duran will email the
          official listing forms and next steps directly.
        </p>
      </div>
    </form>
  );
}
