"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";

const ORDER_STATUSES = [
  "new_order",
  "awaiting_agreement",
  "awaiting_payment",
  "awaiting_photos",
  "needs_review",
  "submitted_to_mls",
  "live",
  "correction_needed",
  "closed_archived"
];

export function AdminOrderDetail({ order, onClose }: { order: any; onClose: () => void }) {
  const [status, setStatus] = useState(order.order_status);
  const [mlsNumber, setMlsNumber] = useState(order.mls_number ?? "");
  const [mlsLink, setMlsLink] = useState(order.mls_link ?? "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingPostedEmail, setSendingPostedEmail] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, mlsNumber, mlsLink, note: note || undefined })
    });
    setSaving(false);
    setNote("");
  }

  async function handleSendListingPosted() {
    setSendingPostedEmail(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "live", mlsNumber, mlsLink, sendListingPostedEmail: true })
    });
    setSendingPostedEmail(false);
    setStatus("live");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-navy">
              {order.properties?.property_address}
            </h2>
            <p className="text-sm text-ink/60">
              {order.sellers?.first_name} {order.sellers?.last_name} · {order.sellers?.email} · {order.sellers?.phone}
            </p>
          </div>
          <button onClick={onClose} className="text-ink/50 hover:text-ink">✕</button>
        </div>

        <div className="mt-4"><StatusBadge status={status} /></div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-navy">Order Status</span>
            <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-navy">MLS Number</span>
            <input className="input mt-1" value={mlsNumber} onChange={(e) => setMlsNumber(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-navy">MLS Link</span>
            <input className="input mt-1" value={mlsLink} onChange={(e) => setMlsLink(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-navy">Add Internal Note</span>
            <textarea className="input mt-1" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-navy px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleSendListingPosted}
            disabled={sendingPostedEmail || !mlsNumber}
            className="rounded-md bg-red px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-white disabled:opacity-40"
          >
            {sendingPostedEmail ? "Sending..." : "Send Listing Posted Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
