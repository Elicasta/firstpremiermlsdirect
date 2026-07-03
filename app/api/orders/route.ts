import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPackageBySlug } from "@/lib/packages";
import { ADDONS } from "@/lib/packages";

// Creates the seller, property, and order rows from the intake wizard. Runs with the
// service-role key since this endpoint validates and shapes the data itself before writing.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { packageSlug, seller, property, listingCopy, photos, selectedAddons } = body;

  const pkg = getPackageBySlug(packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: sellerRow, error: sellerError } = await supabase
    .from("sellers")
    .insert({
      first_name: seller.firstName,
      last_name: seller.lastName,
      email: seller.email,
      phone: seller.phone,
      mailing_address: seller.mailingAddress,
      preferred_contact_method: seller.preferredContactMethod,
      is_legal_owner: seller.isLegalOwner === "yes",
      co_owner_name: seller.coOwnerName || null
    })
    .select()
    .single();

  if (sellerError || !sellerRow) {
    return NextResponse.json({ error: sellerError?.message ?? "Failed to save seller" }, { status: 500 });
  }

  const { data: propertyRow, error: propertyError } = await supabase
    .from("properties")
    .insert({
      seller_id: sellerRow.id,
      property_address: property.propertyAddress,
      city: property.city,
      state: property.state,
      zip: property.zip,
      property_type: property.propertyType,
      bedrooms: Number(property.bedrooms) || 0,
      bathrooms: Number(property.bathrooms) || 0,
      square_feet: Number(property.squareFeet) || 0,
      lot_size: property.lotSize || null,
      year_built: property.yearBuilt ? Number(property.yearBuilt) : null,
      hoa: property.hoa === "yes",
      hoa_amount: property.hoaAmount ? Number(property.hoaAmount) : null,
      property_taxes: property.propertyTaxes ? Number(property.propertyTaxes) : null,
      occupancy_status: property.occupancyStatus,
      listing_price: Number(property.desiredListingPrice) || 0,
      buyer_agent_compensation: property.buyerAgentCompensation || null,
      showing_instructions: property.showingInstructions,
      lockbox_details: property.lockboxDetails || null,
      gate_access: property.gateAccess || null,
      property_highlights: listingCopy?.propertyHighlights || null,
      upgrades: listingCopy?.upgrades || null,
      appliances_included: listingCopy?.appliancesIncluded || null,
      parking: listingCopy?.parking || null,
      community_features: listingCopy?.communityFeatures || null,
      school_info: listingCopy?.schoolInfo || null,
      exclusions: listingCopy?.exclusions || null
    })
    .select()
    .single();

  if (propertyError || !propertyRow) {
    return NextResponse.json({ error: propertyError?.message ?? "Failed to save property" }, { status: 500 });
  }

  const addonTotal = (selectedAddons ?? []).reduce((sum: number, id: string) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);

  const { data: packageRow } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .single();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      package_id: packageRow?.id,
      seller_id: sellerRow.id,
      property_id: propertyRow.id,
      payment_status: "unpaid",
      agreement_status: "unsigned",
      order_status: "awaiting_agreement",
      total_amount: pkg.price + addonTotal,
      selected_addons: selectedAddons ?? []
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json({ error: orderError?.message ?? "Failed to create order" }, { status: 500 });
  }

  if (photos?.method === "schedule") {
    await supabase.from("photo_sessions").insert({
      order_id: orderRow.id,
      requested_dates: (photos.requestedDates ?? "").split(",").map((d: string) => d.trim()).filter(Boolean),
      status: "requested",
      notes: `Best time of day: ${photos.bestTimeOfDay || "no preference"}. Access notes: ${photos.accessNotes || "none"}.`
    });
  }

  return NextResponse.json({ orderId: orderRow.id });
}
