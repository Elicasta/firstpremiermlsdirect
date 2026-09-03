export function formatPurchaseId(orderId: string) {
  const compact = String(orderId ?? "").replace(/-/g, "").toUpperCase();
  const shortId = compact.slice(0, 8);
  return shortId ? `FP-${shortId}` : "FP-ORDER";
}
