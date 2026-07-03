import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20"
});

// Map internal package slugs to Stripe Price IDs. Fill these in from your Stripe dashboard,
// or from env vars so pricing changes don't require a code deploy.
export const STRIPE_PRICE_MAP: Record<string, string | undefined> = {
  basic: process.env.STRIPE_PRICE_BASIC,
  standard: process.env.STRIPE_PRICE_STANDARD,
  premium: process.env.STRIPE_PRICE_PREMIUM
};
