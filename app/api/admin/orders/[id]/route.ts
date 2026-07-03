import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendListingPostedEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status, mlsNumber, mlsLink, note, sendListingPostedEmail: shouldSendEmail } = await req.json();
  const supabase = createServiceRoleClient();

  const updates: Record<string, unknown> = {};
  if (status) updates.order_status = status;
  if (mlsNumber !== undefined) updates.mls_number = mlsNumber || null;
  if (mlsLink !== undefined) updates.mls_link = mlsLink || null;

  const { data: order, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", params.id)
    .select("*, sellers(*), properties(*), packages(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (note) {
    await supabase.from("admin_notes").insert({ order_id: params.id, note });
  }

  if (shouldSendEmail && order) {
    await sendListingPostedEmail(order);
  }

  return NextResponse.json({ success: true });
}
