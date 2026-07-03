// Plain-text/HTML email templates matching the exact copy from the business brief.
// Swap these for React Email components later if you want richer HTML — the
// send functions in lib/email.ts just need a `subject` and `html`/`text` back.

export function adminAlertTemplate(params: {
  packageName: string;
  amount: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  propertyAddress: string;
  photoCount: number;
  agreementSigned: boolean;
  photoSessionNeeded: boolean;
}) {
  const subject = `New MLS Listing Order: ${params.packageName} - ${params.propertyAddress}`;
  const text = `A new First Premier MLS Direct order has been submitted.

Package: ${params.packageName}
Price Paid: ${params.amount}
Seller: ${params.sellerName}
Phone: ${params.sellerPhone}
Email: ${params.sellerEmail}
Property: ${params.propertyAddress}
Photos Uploaded: ${params.photoCount}
Agreement Signed: ${params.agreementSigned ? "Yes" : "No"}
Photo Session Needed: ${params.photoSessionNeeded ? "Yes" : "No"}

Review the submission in the admin dashboard.`;
  return { subject, text };
}

export function clientConfirmationTemplate(params: {
  firstName: string;
  propertyAddress: string;
  packageName: string;
}) {
  const subject = "We received your MLS listing request";
  const text = `Hi ${params.firstName},

Thank you for choosing First Premier MLS Direct.

We received your listing request for:

${params.propertyAddress}

Your selected package:

${params.packageName}

Our team will review your submission, signed agreement, payment, property details, and photos. Once everything is complete and approved, your listing will be prepared for MLS submission.

Most completed listings are submitted within 48 hours after all required items are received.

If we need anything else, we'll contact you directly.

Thank you,
First Premier MLS Direct
305-233-0447`;
  return { subject, text };
}

export function missingInfoTemplate(params: {
  firstName: string;
  propertyAddress: string;
  missingItems: string;
  portalLink: string;
}) {
  const subject = "We need one more item before your MLS listing can move forward";
  const text = `Hi ${params.firstName},

We reviewed your listing request for ${params.propertyAddress}, but we still need the following before we can move forward:

${params.missingItems}

Please upload or complete these items here:

${params.portalLink}

Once everything is complete, we'll continue preparing your listing for MLS submission.

Thank you,
First Premier MLS Direct`;
  return { subject, text };
}

export function listingPostedTemplate(params: {
  firstName: string;
  propertyAddress: string;
  mlsNumber: string;
  listingPrice: string;
  mlsLink: string;
  publicLink: string;
}) {
  const subject = "Your MLS listing has been posted";
  const text = `Hi ${params.firstName},

Your property listing for ${params.propertyAddress} has been posted.

Listing details:

MLS Number: ${params.mlsNumber}
Listing Price: ${params.listingPrice}
MLS Link: ${params.mlsLink}
Public Listing Link: ${params.publicLink}

Please review the listing and let us know if you see anything that needs correction.

Thank you,
First Premier MLS Direct`;
  return { subject, text };
}
