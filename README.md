# First Premier MLS Direct

Flat fee MLS listing website for **First Premier Real Estate Services, Inc.**

**John Duran, Broker**  
Broker License: **0512688**  
Office License: **CQ1025438**

## Current v1 workflow

The public process is intentionally simple:

1. Customer chooses Basic, Standard, or Premium.
2. Customer pays through Stripe Checkout.
3. Stripe returns the customer to a short submission form.
4. Customer provides only:
   - first name
   - last name
   - email
   - phone
   - property address
   - city / state / ZIP
5. The submission is stored in Supabase.
6. Resend emails John with the paid customer, property address, package, amount, phone, and email.
7. John sends the official listing agreement, property forms, disclosures, and package instructions manually from the brokerage email.
8. John handles the remaining broker/MLS process directly with the seller.

There is **no public automated property-detail wizard, photo uploader, e-signature flow, or client portal in the v1 customer journey**. Some older modules remain in the repository for possible future use, but they are not linked from the current public workflow.

## Stack

- Next.js 14 App Router
- React 18
- Tailwind CSS
- Supabase
- Stripe Checkout
- Resend
- Vercel

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in `.env.local` before testing checkout or email.

## Required environment variables

### App

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Production should use the real website URL.

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run `supabase/schema.sql` in the Supabase SQL editor for a new project.

### Stripe

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_STANDARD=
STRIPE_PRICE_PREMIUM=
```

Create one-time Stripe prices for:

- Basic: $299
- Standard: $599
- Premium: $999

Configure the Stripe webhook endpoint:

```text
/api/webhook/stripe
```

Listen for:

```text
checkout.session.completed
```

The webhook marks the order paid and sends the customer a resume link to the short contact form.

The Stripe success URL also includes the Checkout Session ID. The server verifies that session as a fallback so a paid customer is not blocked if the webhook arrives slightly after the browser redirect.

### Resend

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=First Premier MLS Direct <orders@firstpremiermlsdirect.com>
ADMIN_ALERT_EMAIL=
```

`ADMIN_ALERT_EMAIL` is important. Set it to **John Duran's real inbox** in Vercel.

When a paid customer submits the short form, John receives an email containing:

- customer name
- customer phone
- customer email
- property address
- selected package
- amount paid
- a clear instruction to send the official listing documents and next steps

The website does not send the legal/listing forms itself in v1.

### Admin dashboard

```env
ADMIN_PASSWORD_HASH=
```

Generate the hash with:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
```

Admin dashboard:

```text
/admin
```

## Customer checkout flow

### 1. Package selection

`/start-listing`

The customer chooses a package and optional add-ons.

### 2. Draft order

`POST /api/orders/draft`

A real order ID is created before Stripe Checkout. This keeps the payment and later customer submission tied to one record.

### 3. Stripe Checkout

`POST /api/checkout`

The customer pays securely on Stripe.

### 4. Payment confirmation

`POST /api/webhook/stripe`

Stripe marks the order as paid. A lightweight email gives the customer a link back to the short form in case they close the browser.

### 5. Short submission form

`/start-listing/details?order=...`

The customer submits contact information and the property address only.

`PATCH /api/orders/[id]/details`:

- verifies the order is paid
- stores customer contact information
- stores the property address
- changes the order to `awaiting_info`
- sends John's broker alert through Resend

John takes over from there.

## Broker identity shown on the website

The public website identifies:

**First Premier Real Estate Services, Inc.**  
**John Duran, Broker**  
Broker License **0512688**  
Office License **CQ1025438**

This appears on the About page, homepage broker section, Contact page, footer, and Brokerage Disclosure.

## Refund policy

The public refund policy is available at:

```text
/refund-policy
```

It is linked directly from the footer and FAQ page.

Current policy structure:

- full refund may be requested before brokerage work begins
- after brokerage work begins but before MLS submission, refund eligibility depends on work already performed and non-recoverable costs
- after MLS submission, the flat fee MLS package is non-refundable because the primary listing service has been performed
- add-on services are refundable only to the extent they have not been scheduled, started, performed, or committed to a third party
- verified duplicate or incorrect charges are corrected
- applicable non-waivable legal rights remain intact

The refund policy should be reviewed by the broker and, before launch, Florida real estate counsel if John wants legal approval of the exact cancellation/refund terms.

## Public legal pages

- `/terms`
- `/privacy`
- `/refund-policy`
- `/mls-participation-terms`
- `/brokerage-disclosure`

## Public copy rules

The site avoids claims such as:

- guaranteed sale
- guaranteed savings
- better MLS ranking
- guaranteed faster sale

The 48-hour language is conditional on the brokerage receiving and approving all required information, signed documents, usable photos, and other requested items.

## Legacy / future modules

The repository still contains code for features that may be useful later, including:

- client portal
- full property intake wizard
- photo uploads
- e-signature provider abstraction
- deeper order statuses
- admin listing-posted and missing-info tools

These are intentionally not part of the public v1 process. Keeping them in the repo preserves future work without forcing John into an automated process before he is ready.
