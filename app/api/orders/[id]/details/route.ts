import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendClientConfirmationEmail, sendAdminAlertEmail } from "@/lib/email";

// Runs right after Stripe payment succeeds. This is the first point in the new
// checkout-first flow where we actually have a seller name and property address,
// so this is also where the admin alert + client confirmation emails fire from —
// not the Stripe webhook, which only sees a payment with no listing attached to it yet.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { seller, property, listingCopy } = await req.json();
  const supabase = createServiceRoleClient();

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, payment_status, seller_id, property_id")
    .eq("id", params.id)
    .single();

  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existingOrder.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment must be completed before submitting listing details." },
      { status: 402 }
    );
  }

  const sellerPayload = {
    first_name: seller.firstName,
    last_name: seller.lastName,
    email: seller.email,
    phone: seller.phone,
    mailing_address: seller.mailingAddress,
    preferred_contact_method: seller.preferredContactMethod,
    is_legal_owner: seller.isLegalOwner === "yes",
    co_owner_name: seller.coOwnerName || null
  };

  const propertyPayload = {
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
  };

  let sellerId = existingOrder.seller_id;
  let propertyId = existingOrder.property_id;

  if (sellerId) {
    await supabase.from("sellers").update(sellerPayload).eq("id", sellerId);
  } else {
    const { data: sellerRow, error: sellerError } = await supabase
      .from("sellers")
      .insert(sellerPayload)
      .select()
      .single();
    if (sellerError || !sellerRow) {
      return NextResponse.json({ error: sellerError?.message ?? "Failed to save seller" }, { status: 500 });
    }
    sellerId = sellerRow.id;
  }

  if (propertyId) {
    await supabase.from("properties").update(propertyPayload).eq("id", propertyId);
  } else {
    const { data: propertyRow, error: propertyError } = await supabase
      .from("properties")
      .insert({ seller_id: sellerId, ...propertyPayload })
      .select()
      .single();
    if (propertyError || !propertyRow) {
      return NextResponse.json({ error: propertyError?.message ?? "Failed to save property" }, { status: 500 });
    }
    propertyId = propertyRow.id;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({ seller_id: sellerId, property_id: propertyId, order_status: "awaiting_photos" })
    .eq("id", params.id)
    .select("*, sellers(*), properties(*), packages(*)")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Failed to update order" }, { status: 500 });
  }

  await sendAdminAlertEmail(order);
  await sendClientConfirmationEmail(order);

  return NextResponse.json({ success: true });
}
