import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Called when the seller finishes the Photos step, whether they uploaded files
// themselves or asked to schedule a shoot. Either way this is what moves the order
// from "awaiting_photos" to "awaiting_agreement" so the flow can continue.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { method, requestedDates, bestTimeOfDay, accessNotes } = await req.json();

  const supabase = createServiceRoleClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("id", params.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment must be completed first." }, { status: 402 });
  }

  if (method === "schedule") {
    await supabase.from("photo_sessions").insert({
      order_id: params.id,
      requested_dates: (requestedDates ?? "")
        .split(",")
        .map((d: string) => d.trim())
        .filter(Boolean),
      status: "requested",
      notes: `Best time of day: ${bestTimeOfDay || "no preference"}. Access notes: ${accessNotes || "none"}.`
    });
  }

  const { error } = await supabase
    .from("orders")
    .update({ order_status: "awaiting_agreement" })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
