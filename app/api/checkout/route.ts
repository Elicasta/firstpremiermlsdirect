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

  // These two are the most common way this route silently 500s: Stripe rejects a
  // checkout session whose success_url/cancel_url is "undefined/..." if the site
  // URL env var isn't set, and the SDK call throws before anything gets caught.
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

  const priceId = STRIPE_PRICE_MAP[packageSlug];
  const lineItems: Array<{ price?: string; price_data?: any; quantity: number }> = [];

  if (priceId) {
    // Preferred: use a pre-configured Stripe Price object for the package.
    lineItems.push({ price: priceId, quantity: 1 });
  } else {
    // Fallback: build the line item on the fly if a Price ID hasn't been set up yet.
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Payment now happens FIRST, before any seller/property details exist, so
      // success sends the buyer straight into the details step, not a confirmation page.
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/start-listing/details?order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/start-listing?package=${packageSlug}`,
      metadata: { orderId }
    });

    const supabase = createServiceRoleClient();
    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", orderId);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed", err);
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 });
  }
}
