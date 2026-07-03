"use client";

import { useState } from "react";
import { ClientStatusBadge } from "@/components/StatusBadge";
import { toClientStatus, CLIENT_STATUS_DESCRIPTIONS } from "@/lib/clientStatus";
import { OrderStatus } from "@/lib/types";

interface PortalOrder {
  id: string;
  order_status: OrderStatus;
  payment_status: string;
  agreement_status: string;
  mls_number: string | null;
  mls_link: string | null;
  missing_items?: string[];
  properties: { property_address: string } | null;
}

export default function PortalPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<PortalOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/lookup?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setOrder(data.order);
    } catch {
      setError("We couldn't find a listing with that order ID and email. Double-check both and try again.");
    } finally {
      setLoading(false);
    }
  }

  const clientStatus = order ? toClientStatus(order.order_status) : null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Client Portal</h1>
      <p className="mt-4 text-ink/70">
        Check your listing status. Enter the order ID from your confirmation email along with
        your email address.
      </p>

      <form onSubmit={handleLookup} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="font-semibold text-navy">Order ID</span>
          <input className="input mt-1" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-navy">Email</span>
          <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-navy px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white"
        >
          {loading ? "Looking up..." : "Check Status"}
        </button>
      </form>

      {error && <p className="mt-6 text-sm text-red">{error}</p>}

      {order && clientStatus && (
        <div className="mt-8 rounded-lg bg-gray p-6">
          <p className="font-display font-bold text-navy">
            {order.properties?.property_address ?? "Your listing"}
          </p>
          <div className="mt-3"><ClientStatusBadge status={clientStatus} /></div>
          <p className="mt-3 text-sm text-ink/70">{CLIENT_STATUS_DESCRIPTIONS[clientStatus]}</p>

          {clientStatus === "Waiting on Info" && order.missing_items && order.missing_items.length > 0 && (
            <div className="mt-4 rounded-md bg-gold/10 p-4">
              <p className="font-display text-sm font-bold text-navy">What we still need:</p>
              <ul className="mt-2 list-inside list-disc text-sm text-ink/80">
                {order.missing_items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {clientStatus === "Submitted" && order.payment_status === "paid" && !order.properties && (
            <a
              href={`/start-listing/details?order=${order.id}`}
              className="mt-4 inline-block font-display font-bold text-blue underline"
            >
              Finish your listing details →
            </a>
          )}

          {order.mls_number && (
            <p className="mt-4 text-sm text-ink/70">MLS Number: {order.mls_number}</p>
          )}
          {order.mls_link && (
            <p className="mt-1 text-sm">
              <a href={order.mls_link} className="text-blue underline" target="_blank" rel="noopener noreferrer">
                View on MLS
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
