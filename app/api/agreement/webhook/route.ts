import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Webhook receiver for the e-signature provider (Dropbox Sign or DocuSign).
// Configure this URL in the provider's dashboard. Verify the provider's signature
// before trusting the payload in production — omitted here since it's provider-specific.
export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Shape varies by provider — normalize to { envelopeId, status } before using.
  const envelopeId = payload.envelopeId ?? payload.signature_request_id;
  const status = payload.status ?? payload.event_type;

  if (!envelopeId) {
    return NextResponse.json({ error: "Missing envelope id" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const isSigned = status === "signed" || status === "signature_request_all_signed";

  const { data: agreement } = await supabase
    .from("agreements")
    .update({
      status: isSigned ? "signed" : "viewed",
      signed_at: isSigned ? new Date().toISOString() : null
    })
    .eq("provider_envelope_id", envelopeId)
    .select()
    .single();

  if (agreement && isSigned) {
    await supabase
      .from("orders")
      .update({ agreement_status: "signed", order_status: "awaiting_payment" })
      .eq("id", agreement.order_id);
  }

  return NextResponse.json({ received: true });
}
