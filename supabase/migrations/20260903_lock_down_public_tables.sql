-- The current checkout/intake flow writes through authenticated server routes using
-- the Supabase service-role key. No public anon table writes are needed.

alter table public.packages enable row level security;

drop policy if exists "public can insert sellers" on public.sellers;
drop policy if exists "public can insert properties" on public.properties;
drop policy if exists "public can insert orders" on public.orders;
drop policy if exists "public can insert uploads" on public.property_uploads;
