import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPackageBySlug, ADDONS } from "@/lib/packages";

// Creates a draft order the moment someone picks a package, before any seller or
// property info exists. This is what fixes the old "pending" placeholder order id —
// there's now always a real order row for Stripe Checkout and photo uploads to
// attach to, from the very first step.
export async function POST(req: NextRequest) {
  const { packageSlug, selectedAddons } = await req.json();

  const pkg = getPackageBySlug(packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: packageRow } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .single();

  if (!packageRow) {
    return NextResponse.json({ error: "Package not found in database. Run supabase/schema.sql." }, { status: 500 });
  }

  const addonTotal = (selectedAddons ?? []).reduce((sum: number, id: string) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      package_id: packageRow.id,
      seller_id: null,
      property_id: null,
      payment_status: "unpaid",
      agreement_status: "unsigned",
      order_status: "awaiting_payment",
      total_amount: pkg.price + addonTotal,
      selected_addons: selectedAddons ?? []
    })
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message ?? "Failed to create draft order" }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id });
}
