import { NextRequest, NextResponse } from "next/server";
import { getEsignProvider } from "@/lib/esign";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { orderId } = await req.json();

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, sellers(*), properties(*), packages(*)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const provider = getEsignProvider();

  try {
    const result = await provider.sendAgreement({
      orderId,
      signerName: `${order.sellers.first_name} ${order.sellers.last_name}`,
      signerEmail: order.sellers.email,
      propertyAddress: order.properties.property_address,
      packageName: order.packages.name,
      totalAmount: order.total_amount
    });

    await supabase.from("agreements").insert({
      order_id: orderId,
      provider: result.provider,
      provider_envelope_id: result.envelopeId,
      status: "sent"
    });

    return NextResponse.json({ signingUrl: result.signingUrl });
  } catch (err) {
    console.error("Agreement creation failed", err);
    // Until a real e-signature provider is wired up (see lib/esign.ts), this endpoint
    // will error here. That's expected in local/dev without API keys configured.
    return NextResponse.json(
      { error: "E-signature provider not yet configured. See lib/esign.ts." },
      { status: 501 }
    );
  }
}
