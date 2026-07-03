import { OrderStatus } from "./types";

// Clients never see raw backend status strings. This is the only allowed vocabulary
// on the client portal: Submitted, In Review, Waiting on Info, Ready for MLS,
// Submitted to MLS, On MLS.
export type ClientStatus =
  | "Submitted"
  | "Waiting on Info"
  | "In Review"
  | "Ready for MLS"
  | "Submitted to MLS"
  | "On MLS";

const MAP: Record<OrderStatus, ClientStatus> = {
  new_order: "Submitted",
  awaiting_payment: "Submitted",
  awaiting_info: "Waiting on Info",
  awaiting_photos: "Waiting on Info",
  awaiting_agreement: "Waiting on Info",
  correction_needed: "Waiting on Info",
  needs_review: "In Review",
  ready_for_mls: "Ready for MLS",
  submitted_to_mls: "Submitted to MLS",
  live: "On MLS",
  closed_archived: "On MLS"
};

export function toClientStatus(status: OrderStatus): ClientStatus {
  return MAP[status] ?? "Submitted";
}

export const CLIENT_STATUS_DESCRIPTIONS: Record<ClientStatus, string> = {
  Submitted: "We've got your order. Next up is completing your listing details.",
  "Waiting on Info": "We need something from you before we can move forward. Check your email or the note below.",
  "In Review": "Your listing is complete and the broker is reviewing it before MLS submission.",
  "Ready for MLS": "Everything's approved. Your listing is queued to go live on the MLS.",
  "Submitted to MLS": "Your listing has been submitted to the MLS and is being processed.",
  "On MLS": "Your listing is live on the MLS."
};
