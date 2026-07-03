# First Premier MLS Direct

Flat fee MLS listing platform for First Premier Real Estate Services, Inc., a licensed Florida
real estate brokerage. Sellers pick a package, submit property info, sign a listing agreement,
pay, upload photos, and the broker reviews and submits the listing to the MLS.

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
   from reaching `submitted_to_mls` unless it's paid and the agreement is signed.
3. Create a public storage bucket named `property-photos` for uploaded images.
4. Copy your project URL, anon key, and service role key into `.env.local`.

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

## Hard workflow rule

An order cannot move to "Submitted to MLS" unless:

- Payment is completed
- The listing agreement is signed
- Required seller/property data is complete
- Photos are uploaded or a photo session is scheduled
- The broker has approved the submission

This is enforced both in the admin UI and at the database level via a Postgres trigger in
`supabase/schema.sql`.

## Project structure

```
app/                    Pages + API routes (App Router)
  api/                  checkout, webhook/stripe, upload, agreement/*, orders, admin/*
  admin/                Admin dashboard + login
  start-listing/        Multi-step intake wizard
  portal/                Client portal (order status lookup)
components/             Shared UI + IntakeForm step components
lib/                    Supabase clients, Stripe, Resend, validation, e-sign abstraction
emails/                 Email copy templates
supabase/schema.sql     Full DB schema, RLS policies, seed data, MVP-guard trigger
```

## Legal / compliance notes baked into the copy

- Every footer and contact area shows "First Premier Real Estate Services, Inc." and
  "Licensed Florida Real Estate Brokerage" next to the phone number, per Florida advertising
  rules.
- Copy avoids "guaranteed sale," "better MLS ranking," "sell faster," and similar claims —
  see `components/PricingTable.tsx`, `app/page.tsx`, and `emails/templates.ts`.
- The 48-hour turnaround is always stated with its condition: "after all required
  information, payment, signed documents, and usable photos are received."

## What's stubbed vs. real

**Real and working (once env vars are filled in):** package data, pricing page, intake
wizard, Supabase writes, Stripe Checkout session creation + webhook, Resend email sending +
logging, admin dashboard with live Supabase data, status updates, MLS number/link entry,
photo uploads to Supabase Storage.

**Stubbed, needs your API keys/templates:** the two e-signature provider classes in
`lib/esign.ts` throw a clear error until you fill in the real API calls — this is the one
piece that depends entirely on which provider (DocuSign vs. Dropbox Sign) you choose and your
account setup.
