import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const email = req.nextUrl.searchParams.get("email");

  if (!orderId || !email) {
    return NextResponse.json({ error: "Missing orderId or email" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_status, payment_status, agreement_status, mls_number, mls_link, properties(property_address), sellers!inner(email)")
    .eq("id", orderId)
    .eq("sellers.email", email)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
