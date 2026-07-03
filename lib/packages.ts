import { Package } from "./types";

// Source of truth for pricing on the front end. Mirrors the `packages` table in Supabase.
// Update the DB row + this file together, or fetch from Supabase directly once seeded.
export const PACKAGES: Package[] = [
  {
    id: "basic",
    slug: "basic",
    name: "Basic MLS Package",
    price: 299,
    positioning: "DIY MLS Exposure",
    description: "Experienced sellers who just want MLS exposure at the lowest cost.",
    includes: [
      "MLS listing for up to 6 months",
      "Up to 6 seller-uploaded photos",
      "Listing entered into MLS by broker",
      "Seller-provided property description",
      "Showing instructions entered into MLS",
      "One-time listing activation",
      "Email support only"
    ],
    excludes: [
      "Photography",
      "Pricing strategy guidance",
      "Showing coordination",
      "Listing updates beyond corrections"
    ],
    photo_limit: 6,
    listing_term: "Up to 6 months",
    edit_limit: 0,
    includes_photography: false,
    priority_processing: false,
    cta: "Start Basic Listing"
  },
  {
    id: "standard",
    slug: "standard",
    name: "Standard MLS Package",
    price: 599,
    positioning: "Professional Listing",
    description: "Sellers who want a professional listing with guidance and better presentation.",
    includes: [
      "MLS listing 6–12 months, depending on MLS rules",
      "Up to 25 professional photos",
      "Photo shoot by EC Creative Studios",
      "Professionally formatted property description",
      "Pricing guidance with recommended listing range",
      "Showing instructions setup",
      "Up to 2 listing edits or changes",
      "Email and text support during listing period"
    ],
    photo_limit: 25,
    listing_term: "6–12 months",
    edit_limit: 2,
    includes_photography: true,
    priority_processing: false,
    cta: "Choose Standard",
    popular: true
  },
  {
    id: "premium",
    slug: "premium",
    name: "Premium MLS Package",
    price: 999,
    positioning: "Premium Exposure",
    description: "High-value homes or sellers who want maximum exposure and support.",
    includes: [
      "MLS listing up to 12 months, if allowed by MLS rules",
      "Up to 40 professional photos",
      "Full photography package by EC Creative Studios",
      "Interior and exterior photo coverage",
      "Twilight-style photos, if lighting and scheduling allow",
      "Listing headline and description rewritten for marketing impact",
      "Pricing strategy consultation",
      "Up to 5 listing updates or changes",
      "Priority processing",
      "Optional open house coordination guidance",
      "Email, phone, and text support"
    ],
    photo_limit: 40,
    listing_term: "Up to 12 months",
    edit_limit: 5,
    includes_photography: true,
    priority_processing: true,
    cta: "Choose Premium"
  }
];

export const ADDONS = [
  { id: "extra_photos", name: "Extra photo set", price: 75 },
  { id: "drone", name: "Drone photography", price: 150, startingAt: true },
  { id: "rush", name: "Rush listing", price: 100 },
  { id: "open_house_kit", name: "Open house marketing kit", price: 75 },
  { id: "virtual_tour", name: "Virtual tour / video walkthrough", price: 150 }
];

export function getPackageBySlug(slug: string): Package | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}
