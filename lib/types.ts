export type PackageSlug = "basic" | "standard" | "premium";

export interface Package {
  id: string;
  slug: PackageSlug;
  name: string;
  price: number;
  positioning: string;
  description: string;
  includes: string[];
  excludes?: string[];
  photo_limit: number;
  listing_term: string;
  edit_limit: number;
  includes_photography: boolean;
  priority_processing: boolean;
  cta: string;
  popular?: boolean;
}

export type OrderStatus =
  | "new_order"
  | "awaiting_payment"
  | "awaiting_info"
  | "awaiting_photos"
  | "awaiting_agreement"
  | "needs_review"
  | "ready_for_mls"
  | "submitted_to_mls"
  | "live"
  | "correction_needed"
  | "closed_archived";

export interface Order {
  id: string;
  package_id: string;
  seller_id: string | null;
  property_id: string | null;
  stripe_session_id: string | null;
  payment_status: "unpaid" | "paid" | "refunded";
  agreement_status: "unsigned" | "signed";
  order_status: OrderStatus;
  total_amount: number;
  selected_addons: string[];
  mls_number?: string | null;
  mls_link?: string | null;
  public_link?: string | null;
  missing_items?: string[];
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mailing_address: string;
  preferred_contact_method: "email" | "phone" | "text";
  is_legal_owner: boolean;
  co_owner_name?: string | null;
}

export interface Property {
  id: string;
  seller_id: string;
  property_address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size?: string;
  year_built?: number;
  hoa: boolean;
  hoa_amount?: number | null;
  property_taxes?: number | null;
  occupancy_status: string;
  listing_price: number;
  buyer_agent_compensation?: string | null;
  showing_instructions: string;
  lockbox_details?: string | null;
  gate_access?: string | null;
  property_highlights?: string | null;
  upgrades?: string | null;
  appliances_included?: string | null;
  parking?: string | null;
  community_features?: string | null;
  school_info?: string | null;
  exclusions?: string | null;
}
