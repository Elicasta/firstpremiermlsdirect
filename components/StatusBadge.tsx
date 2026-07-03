const LABELS: Record<string, string> = {
  new_order: "New Order",
  awaiting_agreement: "Awaiting Agreement",
  awaiting_payment: "Awaiting Payment",
  awaiting_photos: "Awaiting Photos",
  needs_review: "Needs Review",
  submitted_to_mls: "Submitted to MLS",
  live: "Live",
  correction_needed: "Correction Needed",
  closed_archived: "Closed / Archived"
};

const COLORS: Record<string, string> = {
  new_order: "bg-gray text-ink",
  awaiting_agreement: "bg-gold/20 text-navy",
  awaiting_payment: "bg-gold/20 text-navy",
  awaiting_photos: "bg-blue/10 text-blue",
  needs_review: "bg-blue/10 text-blue",
  submitted_to_mls: "bg-navy/10 text-navy",
  live: "bg-green-100 text-green-800",
  correction_needed: "bg-red/10 text-red",
  closed_archived: "bg-gray text-ink/50"
};

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
