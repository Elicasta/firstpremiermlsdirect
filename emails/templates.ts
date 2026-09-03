// Plain-text email templates for the current broker-led workflow.
// The website collects payment and basic contact information. John Duran then
// sends the official listing forms and next steps from the brokerage email.

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
  const subject = `PAID MLS ORDER - ${params.sellerName} - ${params.propertyAddress}`;
  const text = `John,

A paid First Premier MLS Direct customer submitted their contact information and is ready for your follow-up.

CUSTOMER
Name: ${params.sellerName}
Phone: ${params.sellerPhone}
Email: ${params.sellerEmail}
Property: ${params.propertyAddress}

ORDER
Package: ${params.packageName}
Amount Paid: ${params.amount}

NEXT ACTION
Send the customer the required listing agreement, property forms, and package-specific instructions from your brokerage email.

First Premier MLS Direct`;
  return { subject, text };
}

export function clientConfirmationTemplate(params: {
  firstName: string;
  propertyAddress: string;
  packageName: string;
  orderId: string;
  portalLink: string;
}) {
  const subject = "We received your MLS listing request";
  const text = `Hi ${params.firstName},

Thank you for choosing First Premier MLS Direct.

We received your information for:
${params.propertyAddress}

Package: ${params.packageName}
Order ID: ${params.orderId}

John Duran, Broker, will email the required listing forms and next steps directly from First Premier Real Estate Services, Inc.

Once all required information, signed documents, usable photos, and any other items requested by the broker are received and approved, most completed listings are submitted within 48 hours.

Thank you,
First Premier MLS Direct
First Premier Real Estate Services, Inc.
305-233-0447`;
  return { subject, text };
}

export function missingInfoTemplate(params: {
  firstName: string;
  propertyAddress: string;
  missingItems: string;
  portalLink: string;
}) {
  const subject = "We need additional information for your MLS listing";
  const text = `Hi ${params.firstName},

We reviewed your listing request for ${params.propertyAddress}, but we still need the following before we can move forward:

${params.missingItems}

Please reply to the brokerage's email with the requested information or follow the instructions John provided.

Thank you,
First Premier MLS Direct
First Premier Real Estate Services, Inc.`;
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
First Premier MLS Direct
First Premier Real Estate Services, Inc.`;
  return { subject, text };
}
