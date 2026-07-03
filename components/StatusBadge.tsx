const LABELS: Record<string, string> = {
  new_order: "New Order",
  awaiting_payment: "Awaiting Payment",
  awaiting_info: "Awaiting Info",
  awaiting_photos: "Awaiting Photos",
  awaiting_agreement: "Awaiting Agreement",
  needs_review: "Needs Review",
  ready_for_mls: "Ready for MLS",
  submitted_to_mls: "Submitted to MLS",
  live: "Live",
  correction_needed: "Correction Needed",
  closed_archived: "Closed / Archived"
};

const COLORS: Record<string, string> = {
  new_order: "bg-gray text-ink",
  awaiting_payment: "bg-gold/20 text-navy",
  awaiting_info: "bg-gold/20 text-navy",
  awaiting_photos: "bg-blue/10 text-blue",
  awaiting_agreement: "bg-blue/10 text-blue",
  needs_review: "bg-blue/10 text-blue",
  ready_for_mls: "bg-green-100 text-green-800",
  submitted_to_mls: "bg-navy/10 text-navy",
  live: "bg-green-100 text-green-800",
  correction_needed: "bg-red/10 text-red",
  closed_archived: "bg-gray text-ink/50"
};

// Admin-only. This shows raw backend statuses — clients should always see
// toClientStatus() from lib/clientStatus.ts instead (see ClientStatusBadge below).
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wide ${
        COLORS[status] ?? "bg-gray text-ink"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}

const CLIENT_COLORS: Record<string, string> = {
  Submitted: "bg-gray text-ink",
  "Waiting on Info": "bg-gold/20 text-navy",
  "In Review": "bg-blue/10 text-blue",
  "Ready for MLS": "bg-navy/10 text-navy",
  "Submitted to MLS": "bg-navy/10 text-navy",
  "On MLS": "bg-green-100 text-green-800"
};

// Client-facing. Only ever renders the 6 approved client statuses.
export function ClientStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wide ${
        CLIENT_COLORS[status] ?? "bg-gray text-ink"
      }`}
    >
      {status}
    </span>
  );
}
