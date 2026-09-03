import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendAdminAlertEmail } from "@/lib/email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const propertyAddress = clean(body.propertyAddress);
  const city = clean(body.city);
  const state = clean(body.state).toUpperCase();
  const zip = clean(body.zip);

  if (!firstName || !lastName || !email || !phone || !propertyAddress || !city || !state || !zip) {
    return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (state.length !== 2) {
    return NextResponse.json({ error: "Please use the two-letter state abbreviation." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, payment_status, seller_id, property_id")
    .eq("id", params.id)
    .single();

  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (existingOrder.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment must be completed before submitting your contact information." },
      { status: 402 }
    );
  }

  const fullAddress = `${propertyAddress}, ${city}, ${state} ${zip}`;
  const sellerPayload = {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    // For this simplified first version, the only address collected is the property address.
    // John will collect the seller's full mailing information in the listing documents.
    mailing_address: fullAddress,
    preferred_contact_method: "email",
    is_legal_owner: true,
    co_owner_name: null
  };

  const propertyPayload = {
    property_address: propertyAddress,
    city,
    state,
    zip,
    // Detailed listing data is intentionally collected later by John via the broker forms.
    property_type: "Pending broker intake",
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    lot_size: null,
    year_built: null,
    hoa: false,
    hoa_amount: null,
    property_taxes: null,
    occupancy_status: "Pending broker intake",
    listing_price: 0,
    buyer_agent_compensation: null,
    showing_instructions: null,
    lockbox_details: null,
    gate_access: null,
    property_highlights: null,
    upgrades: null,
    appliances_included: null,
    parking: null,
    community_features: null,
    school_info: null,
    exclusions: null
  };

  let sellerId = existingOrder.seller_id;
  let propertyId = existingOrder.property_id;

  if (sellerId) {
    const { error } = await supabase.from("sellers").update(sellerPayload).eq("id", sellerId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { data: sellerRow, error } = await supabase
      .from("sellers")
      .insert(sellerPayload)
      .select("id")
      .single();
    if (error || !sellerRow) {
      return NextResponse.json({ error: error?.message ?? "Failed to save contact information." }, { status: 500 });
    }
    sellerId = sellerRow.id;
  }

  if (propertyId) {
    const { error } = await supabase.from("properties").update(propertyPayload).eq("id", propertyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { data: propertyRow, error } = await supabase
      .from("properties")
      .insert({ seller_id: sellerId, ...propertyPayload })
      .select("id")
      .single();
    if (error || !propertyRow) {
      return NextResponse.json({ error: error?.message ?? "Failed to save property address." }, { status: 500 });
    }
    propertyId = propertyRow.id;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({ seller_id: sellerId, property_id: propertyId, order_status: "awaiting_info" })
    .eq("id", params.id)
    .select("*, sellers(*), properties(*), packages(*)")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Failed to update order." }, { status: 500 });
  }

  // Resend notifies John. He then sends the official listing forms and next steps
  // from his brokerage email, which is intentionally manual in this first version.
  await sendAdminAlertEmail(order);

  return NextResponse.json({ success: true });
}
