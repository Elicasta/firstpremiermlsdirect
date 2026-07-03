"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { FileText, X } from "lucide-react";

const ORDER_STATUSES = [
  "new_order",
  "awaiting_payment",
  "awaiting_info",
  "awaiting_photos",
  "awaiting_agreement",
  "needs_review",
  "ready_for_mls",
  "submitted_to_mls",
  "live",
  "correction_needed",
  "closed_archived"
];

interface DetailResponse {
  order: any;
  uploads: any[];
  photoSession: any | null;
  notes: any[];
  agreement: any | null;
}

export function AdminOrderDetail({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [mlsNumber, setMlsNumber] = useState("");
  const [mlsLink, setMlsLink] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [note, setNote] = useState("");
  const [missingItemsText, setMissingItemsText] = useState("");
  const [showMissingInfoForm, setShowMissingInfoForm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [sendingPostedEmail, setSendingPostedEmail] = useState(false);
  const [sendingMissingInfo, setSendingMissingInfo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok || cancelled) return;
      const data: DetailResponse = await res.json();
      if (cancelled) return;
      setDetail(data);
      setStatus(data.order.order_status);
      setMlsNumber(data.order.mls_number ?? "");
      setMlsLink(data.order.mls_link ?? "");
      setPublicLink(data.order.public_link ?? "");
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, mlsNumber, mlsLink, publicLink, note: note || undefined })
    });
    setSaving(false);
    setNote("");
  }

  async function handleSendListingPosted() {
    setSendingPostedEmail(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "live", mlsNumber, mlsLink, publicLink, sendListingPostedEmail: true })
    });
    setSendingPostedEmail(false);
    setStatus("live");
  }

  async function handleSendMissingInfo() {
    const items = missingItemsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (items.length === 0) return;

    setSendingMissingInfo(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missingItems: items, sendMissingInfoEmail: true })
    });
    setSendingMissingInfo(false);
    setStatus("correction_needed");
    setMissingItemsText("");
    setShowMissingInfoForm(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
        {loading || !detail ? (
          <div className="py-16 text-center text-ink/50">Loading order...</div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-navy">
                  {detail.order.properties?.property_address ?? "No property address yet"}
                </h2>
                <p className="text-sm text-ink/60">
                  {detail.order.sellers
                    ? `${detail.order.sellers.first_name} ${detail.order.sellers.last_name} · ${detail.order.sellers.email} · ${detail.order.sellers.phone}`
                    : "No seller info yet — payment received, waiting on details step."}
                </p>
              </div>
              <button onClick={onClose} className="text-ink/50 hover:text-ink" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4"><StatusBadge status={status} /></div>

            {/* Seller + property + package summary */}
            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <InfoBlock title="Package">
                {detail.order.packages?.name} — ${detail.order.total_amount}
                {detail.order.selected_addons?.length > 0 && (
                  <div className="mt-1 text-ink/60">Add-ons: {detail.order.selected_addons.join(", ")}</div>
                )}
              </InfoBlock>
              <InfoBlock title="Payment Status">
                {detail.order.payment_status} {detail.order.stripe_session_id ? "(Stripe checkout completed)" : ""}
              </InfoBlock>
              <InfoBlock title="Agreement Status">
                {detail.order.agreement_status}
                {detail.agreement?.signed_pdf_url && (
                  <div className="mt-1">
                    <a href={detail.agreement.signed_pdf_url} className="text-blue underline" target="_blank" rel="noopener noreferrer">
                      Download signed agreement
                    </a>
                  </div>
                )}
              </InfoBlock>
              <InfoBlock title="Mailing Address">
                {detail.order.sellers?.mailing_address ?? "—"}
              </InfoBlock>
              {detail.order.properties && (
                <>
                  <InfoBlock title="Property Details">
                    {detail.order.properties.property_type}, {detail.order.properties.bedrooms} bed /{" "}
                    {detail.order.properties.bathrooms} bath, {detail.order.properties.square_feet} sqft
                  </InfoBlock>
                  <InfoBlock title="Listing Price">
                    ${detail.order.properties.listing_price}
                  </InfoBlock>
                  <InfoBlock title="Showing Instructions">
                    {detail.order.properties.showing_instructions || "—"}
                  </InfoBlock>
                  <InfoBlock title="Buyer Agent Compensation">
                    {detail.order.properties.buyer_agent_compensation || "Not specified"}
                  </InfoBlock>
                </>
              )}
            </div>

            {/* Photo session */}
            <div className="mt-6">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-navy">
                Photo Session
              </p>
              {detail.photoSession ? (
                <div className="mt-2 rounded-md bg-gray p-4 text-sm">
                  <p>Status: {detail.photoSession.status}</p>
                  <p>Requested dates: {(detail.photoSession.requested_dates ?? []).join(", ") || "—"}</p>
                  <p>Confirmed date: {detail.photoSession.confirmed_date ? new Date(detail.photoSession.confirmed_date).toLocaleString() : "Not yet confirmed"}</p>
                  {detail.photoSession.notes && <p className="mt-1 text-ink/60">{detail.photoSession.notes}</p>}
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink/50">No photo session requested — seller is uploading their own photos.</p>
              )}
            </div>

            {/* Uploaded files */}
            <div className="mt-6">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-navy">
                Uploaded Photos &amp; Files ({detail.uploads.length})
              </p>
              {detail.uploads.length === 0 ? (
                <p className="mt-2 text-sm text-ink/50">Nothing uploaded yet.</p>
              ) : (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {detail.uploads.map((upload) => (
                    <a
                      key={upload.id}
                      href={upload.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-md bg-gray"
                      title={upload.file_name}
                    >
                      {upload.file_type?.startsWith("image/") ? (
                        <img src={upload.file_url} alt={upload.file_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink/50">
                          <FileText className="h-6 w-6" />
                          <span className="px-1 text-center text-[10px] leading-tight">{upload.file_name}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Internal notes */}
            <div className="mt-6">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-navy">Internal Notes</p>
              {detail.notes.length === 0 ? (
                <p className="mt-2 text-sm text-ink/50">No notes yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {detail.notes.map((n) => (
                    <li key={n.id} className="rounded-md bg-gray p-3 text-sm">
                      <p>{n.note}</p>
                      <p className="mt-1 text-xs text-ink/40">{new Date(n.created_at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Editable fields */}
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
                <span className="font-semibold text-navy">Public Listing Link</span>
                <input className="input mt-1" value={publicLink} onChange={(e) => setPublicLink(e.target.value)} />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-navy">Add Internal Note</span>
                <textarea className="input mt-1" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
            </div>

            {/* Missing info workflow */}
            {showMissingInfoForm && (
              <div className="mt-4 rounded-md border border-gold/40 bg-gold/5 p-4">
                <label className="block text-sm">
                  <span className="font-semibold text-navy">
                    What's missing? One item per line — this becomes the email sent to the seller.
                  </span>
                  <textarea
                    className="input mt-1"
                    rows={3}
                    placeholder={"Signed disclosure form\nAt least 3 usable photos"}
                    value={missingItemsText}
                    onChange={(e) => setMissingItemsText(e.target.value)}
                  />
                </label>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-navy px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-white disabled:opacity-40"
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

              {!showMissingInfoForm ? (
                <button
                  onClick={() => setShowMissingInfoForm(true)}
                  className="rounded-md border-2 border-gold px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-navy"
                >
                  Request Missing Info
                </button>
              ) : (
                <button
                  onClick={handleSendMissingInfo}
                  disabled={sendingMissingInfo || missingItemsText.trim().length === 0}
                  className="rounded-md border-2 border-gold bg-gold px-5 py-2 font-display text-sm font-bold uppercase tracking-wide text-navy disabled:opacity-40"
                >
                  {sendingMissingInfo ? "Sending..." : "Send Missing Info Request"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-gray p-3">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-navy">{title}</p>
      <div className="mt-1 text-ink/80">{children}</div>
    </div>
  );
}
