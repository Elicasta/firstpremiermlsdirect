"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ContactSubmissionFormProps {
  orderId: string;
}

export function ContactSubmissionForm({ orderId }: ContactSubmissionFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
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
      const response = await fetch(`/api/orders/${orderId}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.error || "We could not save your information.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-gray bg-white p-6 shadow-sm sm:p-8">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">Received</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-navy">
          Thank you. John will take it from here.
        </h2>
        <p className="mt-3 text-ink/70">
          We have your contact information and property address. John Duran, Broker, will email
          you the required listing forms and next steps directly.
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Order ID: <span className="font-semibold text-navy">{orderId}</span>
        </p>
      </div>
    );
  }

  const inputClass = "mt-1 w-full rounded-md border border-gray bg-white px-3 py-2.5 focus-ring";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-lg border border-gray bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">One last step</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-navy">Where should John send your forms?</h2>
        <p className="mt-2 text-sm text-ink/65">
          We only need your contact information and the property address right now. John will
          personally email the listing documents and next steps.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

      <div className="mt-6">
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

      {status === "error" && (
        <p className="mt-4 rounded-md bg-red/5 p-3 text-sm text-red">
          {error || "Something went wrong. Please call 305-233-0447."}
        </p>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={status === "submitting"} showArrow>
        {status === "submitting" ? "Submitting..." : "Submit Contact Information"}
      </Button>

      <p className="mt-3 text-center text-xs text-ink/50">
        Your payment is already complete. This form does not create another charge.
      </p>
    </form>
  );
}
