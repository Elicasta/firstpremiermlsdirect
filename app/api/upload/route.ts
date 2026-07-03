import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "property-photos";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const orderId = formData.get("orderId") as string | null;

  if (!file || !orderId) {
    return NextResponse.json({ error: "Missing file or orderId" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: order } = await supabase
    .from("orders")
    .select("property_id")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const filePath = `${orderId}/${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  await supabase.from("property_uploads").insert({
    property_id: order.property_id,
    order_id: orderId,
    file_url: publicUrl.publicUrl,
    file_name: file.name,
    file_type: file.type,
    uploaded_by: "seller"
  });

  return NextResponse.json({ url: publicUrl.publicUrl });
}
