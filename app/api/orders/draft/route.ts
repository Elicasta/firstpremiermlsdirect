import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPackageBySlug, ADDONS } from "@/lib/packages";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const packageSlug = clean(body.packageSlug);
  const selectedAddons = Array.isArray(body.selectedAddons) ? body.selectedAddons : [];
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const propertyAddress = clean(body.propertyAddress);
  const city = clean(body.city);
  const state = clean(body.state).toUpperCase();
  const zip = clean(body.zip);

  const pkg = getPackageBySlug(packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  if (!firstName || !lastName || !email || !phone || !propertyAddress || !city || !state || !zip) {
    return NextResponse.json({ error: "Please complete every contact and property field." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (state.length !== 2) {
    return NextResponse.json({ error: "Please use the two-letter state abbreviation." }, { status: 400 });
  }

  const invalidAddon = selectedAddons.find((id: unknown) =>
    typeof id !== "string" || !ADDONS.some((addon) => addon.id === id)
  );
  if (invalidAddon) {
    return NextResponse.json({ error: "One of the selected add-ons is invalid." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: packageRow } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .single();

  if (!packageRow) {
    return NextResponse.json({ error: "Package not found in database." }, { status: 500 });
  }

  const fullAddress = `${propertyAddress}, ${city}, ${state} ${zip}`;

  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      mailing_address: fullAddress,
      preferred_contact_method: "email",
      is_legal_owner: true,
      co_owner_name: null
    })
    .select("id")
    .single();

  if (sellerError || !seller) {
    return NextResponse.json(
      { error: sellerError?.message ?? "Failed to save your contact information." },
      { status: 500 }
    );
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .insert({
      seller_id: seller.id,
      property_address: propertyAddress,
      city,
      state,
      zip,
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
    })
    .select("id")
    .single();

  if (propertyError || !property) {
    await supabase.from("sellers").delete().eq("id", seller.id);
    return NextResponse.json(
      { error: propertyError?.message ?? "Failed to save the property address." },
      { status: 500 }
    );
  }

  const addonTotal = selectedAddons.reduce((sum: number, id: string) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      package_id: packageRow.id,
      seller_id: seller.id,
      property_id: property.id,
      payment_status: "unpaid",
      agreement_status: "unsigned",
      order_status: "awaiting_payment",
      total_amount: pkg.price + addonTotal,
      selected_addons: selectedAddons
    })
    .select("id")
    .single();

  if (orderError || !order) {
    await supabase.from("sellers").delete().eq("id", seller.id);
    return NextResponse.json(
      { error: orderError?.message ?? "Failed to create your order." },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderId: order.id });
}
