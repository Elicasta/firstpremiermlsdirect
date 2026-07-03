# First Premier MLS Direct

Flat fee MLS listing platform for First Premier Real Estate Services, Inc., a licensed Florida
real estate brokerage.

Checkout is Amazon-style, pay first: pick a package, pay, then submit property details,
upload or schedule photos, sign a listing agreement, and the broker reviews and submits the
listing to the MLS.

## Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Database / Auth / Storage:** Supabase
- **Payments:** Stripe Checkout
- **Email:** Resend
- **E-signature:** Provider-agnostic abstraction (`lib/esign.ts`) — wire up DocuSign or Dropbox Sign
- **Hosting:** Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

### 1. Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. This creates all tables, seeds the three
   packages, sets up Row Level Security, and adds a database trigger that blocks any order
   from reaching `ready_for_mls` or `submitted_to_mls` unless it's paid and the agreement is
   signed.
3. Create a public storage bucket named `property-photos` for uploaded images.
4. Copy your project URL, anon key, and service role key into `.env.local`.

If you already ran an earlier version of this schema, two things changed and need to be
applied by hand (both are safe to re-run):

```sql
alter table orders alter column seller_id drop not null;
alter table orders alter column property_id drop not null;
alter table orders add column if not exists missing_items jsonb not null default '[]'::jsonb;
```

### 2. Stripe

1. Create Products/Prices for Basic ($299), Standard ($599), Premium ($999), or leave the
   price env vars blank — `/api/checkout` will build line items on the fly as a fallback.
2. Add a webhook endpoint pointing at `/api/webhook/stripe` listening for
   `checkout.session.completed`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

### 3. Resend

Verify a sending domain and set `RESEND_API_KEY` + `RESEND_FROM_EMAIL`.

### 4. E-signature

`lib/esign.ts` defines a provider interface with stub implementations for Dropbox Sign and
DocuSign. Pick one, fill in the real API calls, set `ESIGN_PROVIDER`, and point your
provider's webhook at `/api/agreement/webhook`.

### 5. Admin login

Generate a password hash and set `ADMIN_PASSWORD_HASH`:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"
```

Admin dashboard lives at `/admin` (redirects to `/admin/login` if not authenticated).

## The checkout flow, in order

1. `/start-listing` — pick a package and add-ons only. No seller or property info yet.
2. `POST /api/orders/draft` creates a real order row (no seller/property attached) before
   Stripe ever loads. This is what makes sure every downstream step, including photo
   uploads, always has a real order id to attach to. Nothing ever falls back to a fake
   `"pending"` id.
3. `POST /api/checkout` creates the Stripe Checkout session and redirects to Stripe.
4. Stripe webhook (`/api/webhook/stripe`) marks the order paid and emails a "finish your
   listing" link straight from the email Stripe collected, in case the seller closes the tab
   before finishing.
5. `/start-listing/details?order=...` — seller info, property info, listing copy. Submitting
   this (`PATCH /api/orders/[id]/details`) is what actually creates the seller and property
   rows, and is also where the real client confirmation + admin alert emails fire from, since
   that's the first point a name and address exist.
6. Photos step — upload or schedule. `POST /api/orders/[id]/photos` advances the order status.
7. Agreement step — `AgreementSigner` sends the agreement via whichever e-sign provider is
   configured. Signing webhook moves the order to `needs_review`.
8. Admin reviews in `/admin`, sets `ready_for_mls`, `submitted_to_mls`, then `live`.

## Client-facing statuses

Clients never see backend status strings like `awaiting_agreement`. `lib/clientStatus.ts` maps
every backend status down to one of six client-facing labels: Submitted, Waiting on Info, In
Review, Ready for MLS, Submitted to MLS, On MLS. The portal (`/portal`) only ever renders
those six.

## Hard workflow rule

An order cannot move to `ready_for_mls` or `submitted_to_mls` unless:

- Payment is completed
- The listing agreement is signed
- Required seller/property data is complete
- Photos are uploaded or a photo session is scheduled
- The broker has approved the submission

This is enforced in the admin UI and at the database level via a Postgres trigger in
`supabase/schema.sql`.

## Missing info workflow

From the admin order detail modal: enter missing items (one per line), hit "Request Missing
Info." This sends the missing-info email, logs it in `email_logs`, sets the order status to
`correction_needed` (shown to the client as "Waiting on Info"), and stores the list on
`orders.missing_items` so the client portal can show exactly what's needed.

## Project structure

```
app/
  start-listing/               Package + add-on selection (pre-payment)
  start-listing/details/       Property details, photos, agreement (post-payment)
  api/orders/draft/            Creates the draft order before Stripe
  api/orders/[id]/details/     Creates seller + property, sends confirmation + admin alert
  api/orders/[id]/photos/      Advances status after the photos step
  api/checkout/                Stripe Checkout session creation
  api/webhook/stripe/          Payment confirmation + resume-listing email
  api/agreement/*              E-sign creation + webhook
  api/admin/orders/[id]/       Admin GET (full detail) + PATCH (status, MLS fields, missing info)
  admin/                       Admin dashboard + login
  portal/                      Client portal (order status lookup, client-safe labels only)
  refund-policy/, mls-participation-terms/, brokerage-disclosure/, terms/, privacy/
components/IntakeForm/         PackageSelectForm (pre-payment), DetailsWizard (post-payment),
                                shared step components used by DetailsWizard
lib/clientStatus.ts            Backend status -> client-safe label mapping
lib/                           Supabase clients, Stripe, Resend, validation, e-sign abstraction
emails/                        Email copy templates
supabase/schema.sql            Full DB schema, RLS policies, seed data, MVP-guard trigger
```

## Legal / compliance notes baked into the copy

- Every footer, legal page, and contact area shows "First Premier Real Estate Services,
  Inc.," "Licensed Florida Real Estate Brokerage," the brokerage address (13265 SW 124
  Street, Miami, FL 33186), and the phone number, per Florida advertising rules.
- Copy avoids "guaranteed sale," "better MLS ranking," "sell faster," "guaranteed savings,"
  and similar claims.
- Hero and FAQ copy specifically avoid implying buyer agent compensation never applies — the
  seller always chooses whether to offer it.
- The 48-hour turnaround is always stated with its condition: "after all required
  information, payment, signed documents, and usable photos are received."
- Legal pages: Terms, Privacy, Refund Policy, MLS Participation Terms, Brokerage Disclosure.

## What's stubbed vs. real

**Real and working (once env vars are filled in):** package data, pricing page, the full
pay-first checkout flow, Supabase writes, Stripe Checkout session creation + webhook, Resend
email sending + logging (including the resume-listing and missing-info emails), admin
dashboard with live Supabase data including uploaded photos/files/notes/photo sessions,
status updates, MLS number/link/public link entry, photo uploads to Supabase Storage.

**Stubbed, needs your API keys/templates:** the two e-signature provider classes in
`lib/esign.ts` throw a clear error until you fill in the real API calls, this is the one
piece that depends entirely on which provider (DocuSign vs. Dropbox Sign) you choose and your
account setup. The "Schedule a Call" button on the Contact page is a visible placeholder
until a Calendly (or similar) link is wired in.
