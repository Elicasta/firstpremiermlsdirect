-- First Premier MLS Direct — Supabase schema
-- Run this in the Supabase SQL editor, or via `supabase db push` with this file in migrations/.

create extension if not exists "uuid-ossp";

-- ============================================================
-- packages
-- ============================================================
create table if not exists packages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  price numeric(10,2) not null,
  description text,
  photo_limit int not null default 0,
  listing_term text,
  edit_limit int not null default 0,
  includes_photography boolean not null default false,
  priority_processing boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- sellers
-- ============================================================
create table if not exists sellers (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  mailing_address text not null,
  preferred_contact_method text check (preferred_contact_method in ('email','phone','text')) default 'email',
  is_legal_owner boolean not null default true,
  co_owner_name text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- properties
-- ============================================================
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references sellers(id) on delete cascade,
  property_address text not null,
  city text not null,
  state text not null,
  zip text not null,
  property_type text not null,
  bedrooms int not null default 0,
  bathrooms numeric(3,1) not null default 0,
  square_feet int not null default 0,
  lot_size text,
  year_built int,
  hoa boolean not null default false,
  hoa_amount numeric(10,2),
  property_taxes numeric(10,2),
  occupancy_status text,
  listing_price numeric(12,2) not null,
  buyer_agent_compensation text,
  showing_instructions text,
  lockbox_details text,
  gate_access text,
  property_highlights text,
  upgrades text,
  appliances_included text,
  parking text,
  community_features text,
  school_info text,
  exclusions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- orders
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid not null references packages(id),
  seller_id uuid not null references sellers(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  stripe_session_id text,
  payment_status text check (payment_status in ('unpaid','paid','refunded')) default 'unpaid',
  agreement_status text check (agreement_status in ('unsigned','signed')) default 'unsigned',
  order_status text check (order_status in (
    'new_order','awaiting_agreement','awaiting_payment','awaiting_photos',
    'needs_review','submitted_to_mls','live','correction_needed','closed_archived'
  )) default 'new_order',
  total_amount numeric(10,2) not null,
  selected_addons jsonb not null default '[]'::jsonb,
  mls_number text,
  mls_link text,
  public_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hard rule enforced in application logic (see lib/orderRules.ts) AND mirrored here as a guard:
-- an order cannot move to 'submitted_to_mls' unless payment_status = 'paid' and
-- agreement_status = 'signed'. This trigger blocks it at the database level too.
create or replace function enforce_ready_for_mls()
returns trigger as $$
begin
  if new.order_status = 'submitted_to_mls' and
     (new.payment_status is distinct from 'paid' or new.agreement_status is distinct from 'signed') then
    raise exception 'Order cannot move to submitted_to_mls until payment is paid and agreement is signed';
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_enforce_ready_for_mls on orders;
create trigger trg_enforce_ready_for_mls
  before update on orders
  for each row execute function enforce_ready_for_mls();

-- ============================================================
-- property_uploads (seller photos, disclosures, any file)
-- ============================================================
create table if not exists property_uploads (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text not null,
  uploaded_by text check (uploaded_by in ('seller','admin')) default 'seller',
  created_at timestamptz not null default now()
);

-- ============================================================
-- agreements
-- ============================================================
create table if not exists agreements (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text check (provider in ('dropboxsign','docusign')) not null,
  provider_envelope_id text,
  signed_pdf_url text,
  status text check (status in ('sent','viewed','signed','declined','voided')) default 'sent',
  signed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- photo_sessions
-- ============================================================
create table if not exists photo_sessions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  requested_dates jsonb not null default '[]'::jsonb,
  confirmed_date timestamptz,
  status text check (status in ('requested','confirmed','completed','cancelled')) default 'requested',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- email_logs
-- ============================================================
create table if not exists email_logs (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  email_type text check (email_type in (
    'admin_alert','client_confirmation','missing_info','listing_posted'
  )) not null,
  recipient text not null,
  subject text not null,
  sent_at timestamptz not null default now(),
  status text check (status in ('sent','failed')) default 'sent'
);

-- ============================================================
-- admin_notes
-- ============================================================
create table if not exists admin_notes (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  admin_user_id uuid,
  note text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Seed the three packages
-- ============================================================
insert into packages (name, slug, price, description, photo_limit, listing_term, edit_limit, includes_photography, priority_processing)
values
  ('Basic MLS Package', 'basic', 299, 'DIY MLS exposure at the lowest cost.', 6, 'Up to 6 months', 0, false, false),
  ('Standard MLS Package', 'standard', 599, 'Professional listing with photography and guidance.', 25, '6–12 months', 2, true, false),
  ('Premium MLS Package', 'premium', 999, 'Maximum exposure and support for high-value homes.', 40, 'Up to 12 months', 5, true, true)
on conflict (slug) do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table sellers enable row level security;
alter table properties enable row level security;
alter table orders enable row level security;
alter table property_uploads enable row level security;
alter table agreements enable row level security;
alter table photo_sessions enable row level security;
alter table email_logs enable row level security;
alter table admin_notes enable row level security;

-- Public (anon) inserts are allowed only for the initial intake write from the Start Listing flow.
-- Everything else (reads, updates) goes through the service-role key from server routes / admin dashboard.
create policy "public can insert sellers" on sellers for insert to anon with check (true);
create policy "public can insert properties" on properties for insert to anon with check (true);
create policy "public can insert orders" on orders for insert to anon with check (true);
create policy "public can insert uploads" on property_uploads for insert to anon with check (true);

-- No public select/update/delete policies are defined, so anon access to read or modify
-- existing rows is denied by default. Admin dashboard and API routes use the service-role
-- key, which bypasses RLS entirely.
