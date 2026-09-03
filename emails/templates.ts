const NAVY = "#062B56";
const GOLD = "#C9A44C";
const RED = "#D71920";
const WARM = "#F8F5EF";
const INK = "#1F2937";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const SOFT = "#F7F9FC";

export type EmailAddon = {
  name: string;
  price: string;
};

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function line(label: string, value: string) {
  return `<tr>
    <td width="120" style="padding-top:10px;padding-bottom:10px;padding-left:0;padding-right:18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};vertical-align:top;white-space:nowrap;">${esc(label)}</td>
    <td style="padding-top:10px;padding-bottom:10px;padding-left:0;padding-right:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:21px;color:${INK};font-weight:700;vertical-align:top;">${esc(value)}</td>
  </tr>`;
}

function addOnsRow(addons: EmailAddon[]) {
  if (!addons.length) return line("Add-ons", "None");

  const rows = addons
    .map(
      (addon, index) => `<tr>
        <td style="padding-top:${index === 0 ? "0" : "7px"};padding-bottom:7px;padding-left:0;padding-right:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:${INK};font-weight:600;vertical-align:top;">${esc(addon.name)}</td>
        <td align="right" style="padding-top:${index === 0 ? "0" : "7px"};padding-bottom:7px;padding-left:10px;padding-right:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:${NAVY};font-weight:800;vertical-align:top;white-space:nowrap;">${esc(addon.price)}</td>
      </tr>`
    )
    .join("");

  return `<tr>
    <td width="120" style="padding-top:10px;padding-bottom:10px;padding-left:0;padding-right:18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};vertical-align:top;white-space:nowrap;">Add-ons</td>
    <td style="padding-top:10px;padding-bottom:3px;padding-left:0;padding-right:0;vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        ${rows}
      </table>
    </td>
  </tr>`;
}

function purchaseDetails(params: {
  packageName: string;
  addons: EmailAddon[];
  amount: string;
  orderId: string;
}) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SOFT}" style="width:100%;margin-top:22px;background-color:${SOFT};border:1px solid ${BORDER};border-radius:8px;">
    <tr>
      <td style="padding-top:14px;padding-bottom:14px;padding-left:18px;padding-right:18px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
          ${line("Package", params.packageName)}
          ${addOnsRow(params.addons)}
          ${line("Amount paid", params.amount)}
          ${line("Purchase ID", params.orderId)}
        </table>
      </td>
    </tr>
  </table>`;
}

function addOnsText(addons: EmailAddon[]) {
  if (!addons.length) return "Add-ons: None";
  return `Add-ons:\n${addons.map((addon) => `- ${addon.name} ${addon.price}`).join("\n")}`;
}

function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
    <tr>
      <td bgcolor="${RED}" style="background-color:${RED};border-radius:6px;">
        <a href="${esc(href)}" style="display:inline-block;padding-top:13px;padding-bottom:13px;padding-left:20px;padding-right:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;color:#ffffff;text-decoration:none;font-weight:700;">${esc(label)}</a>
      </td>
    </tr>
  </table>`;
}

function shell(params: {
  preview: string;
  eyebrow: string;
  title: string;
  body: string;
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:${WARM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${WARM}" style="width:100%;background-color:${WARM};">
    <tr>
      <td align="center" style="padding-top:24px;padding-bottom:24px;padding-left:12px;padding-right:12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
          <tr>
            <td style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${esc(params.preview)}</td>
          </tr>
          <tr>
            <td bgcolor="${NAVY}" style="background-color:${NAVY};padding-top:24px;padding-bottom:24px;padding-left:28px;padding-right:28px;border-radius:10px 10px 0 0;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:30px;color:#ffffff;">First Premier <span style="color:${GOLD};">MLS Direct</span></p>
              <p style="margin-top:6px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#D7DFEA;letter-spacing:0.6px;">FIRST PREMIER REAL ESTATE SERVICES, INC.</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding-top:32px;padding-bottom:32px;padding-left:28px;padding-right:28px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:${GOLD};font-weight:700;letter-spacing:1px;text-transform:uppercase;">${esc(params.eyebrow)}</p>
              <h1 style="margin-top:8px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:34px;color:${NAVY};font-weight:800;">${esc(params.title)}</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:20px;">
                <tr><td>${params.body}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="${NAVY}" style="background-color:${NAVY};padding-top:22px;padding-bottom:22px;padding-left:28px;padding-right:28px;border-radius:0 0 10px 10px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#ffffff;font-weight:700;">First Premier MLS Direct</p>
              <p style="margin-top:4px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#D7DFEA;">First Premier Real Estate Services, Inc. · John Duran, Broker</p>
              <p style="margin-top:2px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#D7DFEA;">Broker License 0512688 · Office License CQ1025438</p>
              <p style="margin-top:2px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#D7DFEA;">13265 SW 124 Street, Miami, FL 33186 · 305-233-0447</p>
              <p style="margin-top:2px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#D7DFEA;">info@premiermlsdirect.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function adminAlertTemplate(params: {
  packageName: string;
  addons: EmailAddon[];
  amount: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  propertyAddress: string;
  orderId: string;
}) {
  const subject = `New paid MLS order: ${params.sellerName}`;
  const text = `John,\n\nA customer completed payment for First Premier MLS Direct and is ready for follow-up.\n\nCUSTOMER\nName: ${params.sellerName}\nPhone: ${params.sellerPhone}\nEmail: ${params.sellerEmail}\nProperty: ${params.propertyAddress}\n\nPURCHASE\nPackage: ${params.packageName}\n${addOnsText(params.addons)}\nAmount paid: ${params.amount}\nPurchase ID: ${params.orderId}\n\nNEXT ACTION\nSend the customer the required listing agreement, property forms, and package-specific instructions.\n\nFirst Premier MLS Direct`;

  const body = `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">John, a customer completed payment and is ready for your brokerage follow-up.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:22px;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">
      ${line("Name", params.sellerName)}
      ${line("Phone", params.sellerPhone)}
      ${line("Email", params.sellerEmail)}
      ${line("Property", params.propertyAddress)}
    </table>
    ${purchaseDetails({ packageName: params.packageName, addons: params.addons, amount: params.amount, orderId: params.orderId })}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:22px;">
      <tr>
        <td bgcolor="#FFF8E5" style="background-color:#FFF8E5;border-left:4px solid ${GOLD};padding-top:16px;padding-bottom:16px;padding-left:16px;padding-right:16px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${NAVY};font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">Next action</p>
          <p style="margin-top:6px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${INK};">Send the customer the required listing agreement, property forms, and package-specific instructions.</p>
        </td>
      </tr>
    </table>`;

  return {
    subject,
    text,
    html: shell({ preview: `New paid MLS order from ${params.sellerName}`, eyebrow: "Paid order", title: "New MLS order received", body })
  };
}

export function clientConfirmationTemplate(params: {
  firstName: string;
  propertyAddress: string;
  packageName: string;
  addons: EmailAddon[];
  amount: string;
  orderId: string;
}) {
  const subject = "Your First Premier MLS Direct payment is confirmed";
  const text = `Hi ${params.firstName},\n\nThank you for choosing First Premier MLS Direct. Your payment is confirmed and your order is now with the brokerage.\n\nProperty: ${params.propertyAddress}\n\nPURCHASE\nPackage: ${params.packageName}\n${addOnsText(params.addons)}\nAmount paid: ${params.amount}\nPurchase ID: ${params.orderId}\n\nJohn Duran, Broker, will email the required listing forms and next steps directly from First Premier Real Estate Services, Inc.\n\nFirst Premier MLS Direct\n305-233-0447\ninfo@premiermlsdirect.com`;

  const body = `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Hi ${esc(params.firstName)},</p>
    <p style="margin-top:12px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Thank you for choosing First Premier MLS Direct. Your payment is confirmed and your order is now with the brokerage.</p>
    <p style="margin-top:18px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:${MUTED};">Property</p>
    <p style="margin-top:3px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${INK};font-weight:700;">${esc(params.propertyAddress)}</p>
    ${purchaseDetails({ packageName: params.packageName, addons: params.addons, amount: params.amount, orderId: params.orderId })}
    <p style="margin-top:22px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">John Duran, Broker, will email the required listing forms and next steps directly from First Premier Real Estate Services, Inc.</p>
    ${button("Email First Premier MLS Direct", "mailto:info@premiermlsdirect.com")}`;

  return {
    subject,
    text,
    html: shell({ preview: "Your payment is confirmed and John Duran will send your next steps.", eyebrow: "Payment confirmed", title: "Thank you. We have your order.", body })
  };
}

export function missingInfoTemplate(params: {
  firstName: string;
  propertyAddress: string;
  missingItems: string;
}) {
  const subject = "We need additional information for your MLS listing";
  const text = `Hi ${params.firstName},\n\nWe reviewed your listing request for ${params.propertyAddress}, but we still need the following before we can move forward:\n\n${params.missingItems}\n\nPlease reply to this email with the requested information or follow the instructions John provided.\n\nFirst Premier MLS Direct\n305-233-0447`;
  const itemsHtml = params.missingItems
    .split("\n")
    .filter(Boolean)
    .map((item) => `<li style="margin-bottom:6px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${INK};">${esc(item.replace(/^[-•]\s*/, ""))}</li>`)
    .join("");

  const body = `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Hi ${esc(params.firstName)},</p>
    <p style="margin-top:12px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">We reviewed your listing request for <strong>${esc(params.propertyAddress)}</strong>, but we still need the following before we can move forward:</p>
    <ul style="margin-top:16px;margin-bottom:0;padding-left:22px;">${itemsHtml}</ul>
    <p style="margin-top:18px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${MUTED};">Please reply to this email with the requested information or follow the instructions John provided.</p>
    ${button("Reply to First Premier MLS Direct", "mailto:info@premiermlsdirect.com")}`;

  return {
    subject,
    text,
    html: shell({ preview: "We need a little more information to continue your MLS listing.", eyebrow: "Listing update", title: "We need one more item", body })
  };
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
  const text = `Hi ${params.firstName},\n\nYour property listing for ${params.propertyAddress} has been posted.\n\nMLS Number: ${params.mlsNumber}\nListing Price: ${params.listingPrice}\nMLS Link: ${params.mlsLink}\nPublic Listing Link: ${params.publicLink}\n\nPlease review the listing and let us know if you see anything that needs correction.\n\nFirst Premier MLS Direct\n305-233-0447`;
  const viewLink = params.publicLink || params.mlsLink;

  const body = `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Hi ${esc(params.firstName)},</p>
    <p style="margin-top:12px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">Your property listing for <strong>${esc(params.propertyAddress)}</strong> has been posted.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:22px;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">
      ${line("MLS number", params.mlsNumber)}
      ${line("Listing price", params.listingPrice)}
    </table>
    <p style="margin-top:18px;margin-bottom:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${MUTED};">Please review the listing and let us know if you see anything that needs correction.</p>
    ${viewLink ? button("View Your Listing", viewLink) : ""}`;

  return {
    subject,
    text,
    html: shell({ preview: "Your First Premier MLS Direct listing is now posted.", eyebrow: "Listing live", title: "Your MLS listing is now active", body })
  };
}

export function contactAlertTemplate(params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const subject = `New website inquiry: ${params.name}`;
  const text = `New website inquiry\n\nName: ${params.name}\nEmail: ${params.email}\nPhone: ${params.phone || "Not provided"}\n\nMessage:\n${params.message}`;
  const body = `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:${INK};">A visitor sent a message through premiermlsdirect.com.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:22px;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">
      ${line("Name", params.name)}
      ${line("Email", params.email)}
      ${line("Phone", params.phone || "Not provided")}
    </table>
    <p style="margin-top:22px;margin-bottom:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${NAVY};font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:${INK};white-space:pre-line;">${esc(params.message)}</p>`;

  return {
    subject,
    text,
    html: shell({ preview: `New website inquiry from ${params.name}`, eyebrow: "Website inquiry", title: "New message from your website", body })
  };
}
