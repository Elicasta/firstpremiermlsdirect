import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendListingPostedEmail, sendMissingInfoEmail } from "@/lib/email";

// Full order detail for the admin modal: seller, property, package, uploaded files,
// photo session, agreement, and internal notes, in one call.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const [{ data: order }, { data: uploads }, { data: photoSession }, { data: notes }, { data: agreement }] =
    await Promise.all([
      supabase.from("orders").select("*, sellers(*), properties(*), packages(*)").eq("id", params.id).single(),
      supabase.from("property_uploads").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
      supabase.from("photo_sessions").select("*").eq("order_id", params.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("admin_notes").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
      supabase.from("agreements").select("*").eq("order_id", params.id).order("created_at", { ascending: false }).limit(1).maybeSingle()
    ]);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order, uploads: uploads ?? [], photoSession, notes: notes ?? [], agreement });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    status,
    mlsNumber,
    mlsLink,
    publicLink,
    note,
    sendListingPostedEmail: shouldSendPostedEmail,
    missingItems,
    sendMissingInfoEmail: shouldSendMissingInfo
  } = await req.json();

  const supabase = createServiceRoleClient();

  const updates: Record<string, unknown> = {};
  if (status) updates.order_status = status;
  if (mlsNumber !== undefined) updates.mls_number = mlsNumber || null;
  if (mlsLink !== undefined) updates.mls_link = mlsLink || null;
  if (publicLink !== undefined) updates.public_link = publicLink || null;

  // Sending a missing-info request always overrides whatever status was passed in —
  // that's the whole point of the workflow, so it can't be forgotten as a side effect.
  if (shouldSendMissingInfo && Array.isArray(missingItems) && missingItems.length > 0) {
    updates.order_status = "correction_needed";
    updates.missing_items = missingItems;
  }

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

  if (shouldSendPostedEmail && order) {
    await sendListingPostedEmail(order);
  }

  if (shouldSendMissingInfo && order && Array.isArray(missingItems) && missingItems.length > 0) {
    await sendMissingInfoEmail(order, missingItems);
  }

  return NextResponse.json({ success: true });
}
