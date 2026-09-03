import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_MAP } from "@/lib/stripe";
import { getPackageBySlug, ADDONS } from "@/lib/packages";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { orderId, packageSlug, selectedAddons } = await req.json();

  const pkg = getPackageBySlug(packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return NextResponse.json(
      { error: "Server misconfigured: NEXT_PUBLIC_SITE_URL is not set in Vercel." },
      { status: 500 }
    );
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: STRIPE_SECRET_KEY is not set in Vercel." },
      { status: 500 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status, sellers(email)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.payment_status === "paid") {
    return NextResponse.json({ error: "This order has already been paid." }, { status: 409 });
  }

  const priceId = STRIPE_PRICE_MAP[packageSlug];
  const lineItems: Array<{ price?: string; price_data?: any; quantity: number }> = [];

  if (priceId) {
    lineItems.push({ price: priceId, quantity: 1 });
  } else {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: pkg.name },
        unit_amount: pkg.price * 100
      },
      quantity: 1
    });
  }

  for (const addonId of selectedAddons ?? []) {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (!addon) continue;
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: addon.name },
        unit_amount: addon.price * 100
      },
      quantity: 1
    });
  }

  const sellerRelation = (order as any).sellers;
  const customerEmail = Array.isArray(sellerRelation) ? sellerRelation[0]?.email : sellerRelation?.email;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      client_reference_id: orderId,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/start-listing/details?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/start-listing?package=${packageSlug}`,
      metadata: { orderId }
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", orderId);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 });
  }
}
