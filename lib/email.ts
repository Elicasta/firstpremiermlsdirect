import { getResend, FROM_EMAIL, REPLY_TO_EMAIL } from "./resend";
import { createServiceRoleClient } from "./supabase/server";
import { ADDONS } from "./packages";
import {
  adminAlertTemplate,
  clientConfirmationTemplate,
  missingInfoTemplate,
  listingPostedTemplate
} from "@/emails/templates";

async function logEmail(params: {
  orderId: string;
  emailType: "admin_alert" | "client_confirmation" | "missing_info" | "listing_posted";
  recipient: string;
  subject: string;
  status: "sent" | "failed";
}) {
  const supabase = createServiceRoleClient();
  await supabase.from("email_logs").insert({
    order_id: params.orderId,
    email_type: params.emailType,
    recipient: params.recipient,
    subject: params.subject,
    status: params.status
  });
}

function fullAddress(order: any) {
  const property = order.properties;
  if (!property) return "Property address not available";
  return [
    property.property_address,
    [property.city, property.state, property.zip].filter(Boolean).join(" ")
  ]
    .filter(Boolean)
    .join(", ");
}

function packageSummary(order: any) {
  const packageName = order.packages?.name ?? "MLS Package";
  const selectedAddonIds = Array.isArray(order.selected_addons) ? order.selected_addons : [];
  const selectedAddons = selectedAddonIds
    .map((id: string) => ADDONS.find((addon) => addon.id === id))
    .filter(Boolean)
    .map((addon) => `${addon!.name} (+$${addon!.price})`);

  if (!selectedAddons.length) return `${packageName} • No add-ons`;
  return `${packageName} • Add-ons: ${selectedAddons.join(", ")}`;
}

export async function sendAdminAlertEmail(order: any) {
  const { subject, text, html } = adminAlertTemplate({
    packageName: packageSummary(order),
    amount: `$${Number(order.total_amount ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    sellerName: `${order.sellers?.first_name ?? ""} ${order.sellers?.last_name ?? ""}`.trim(),
    sellerPhone: order.sellers?.phone ?? "Not provided",
    sellerEmail: order.sellers?.email ?? "Not provided",
    propertyAddress: fullAddress(order),
    orderId: order.id
  });

  const recipient = process.env.ADMIN_ALERT_EMAIL ?? "Jduran238@bellsouth.net";

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: recipient,
      replyTo: order.sellers?.email || undefined,
      subject,
      text,
      html
    });
    await logEmail({ orderId: order.id, emailType: "admin_alert", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Admin alert email failed", err);
    await logEmail({ orderId: order.id, emailType: "admin_alert", recipient, subject, status: "failed" });
  }
}

export async function sendClientConfirmationEmail(order: any) {
  const recipient = order.sellers?.email;
  if (!recipient) return;

  const { subject, text, html } = clientConfirmationTemplate({
    firstName: order.sellers?.first_name ?? "there",
    propertyAddress: fullAddress(order),
    packageName: packageSummary(order),
    orderId: order.id
  });

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: recipient,
      replyTo: REPLY_TO_EMAIL,
      subject,
      text,
      html
    });
    await logEmail({ orderId: order.id, emailType: "client_confirmation", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Client confirmation email failed", err);
    await logEmail({ orderId: order.id, emailType: "client_confirmation", recipient, subject, status: "failed" });
  }
}

export async function sendMissingInfoEmail(order: any, missingItems: string[]) {
  const recipient = order.sellers?.email;
  if (!recipient) return;

  const { subject, text, html } = missingInfoTemplate({
    firstName: order.sellers?.first_name ?? "there",
    propertyAddress: fullAddress(order),
    missingItems: missingItems.map((item) => `- ${item}`).join("\n")
  });

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: recipient,
      replyTo: REPLY_TO_EMAIL,
      subject,
      text,
      html
    });
    await logEmail({ orderId: order.id, emailType: "missing_info", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Missing info email failed", err);
    await logEmail({ orderId: order.id, emailType: "missing_info", recipient, subject, status: "failed" });
  }
}

export async function sendListingPostedEmail(order: any) {
  const recipient = order.sellers?.email;
  if (!recipient) return;

  const { subject, text, html } = listingPostedTemplate({
    firstName: order.sellers?.first_name ?? "there",
    propertyAddress: fullAddress(order),
    mlsNumber: order.mls_number ?? "",
    listingPrice: order.properties?.listing_price
      ? `$${Number(order.properties.listing_price).toLocaleString("en-US")}`
      : "",
    mlsLink: order.mls_link ?? "",
    publicLink: order.public_link ?? ""
  });

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: recipient,
      replyTo: REPLY_TO_EMAIL,
      subject,
      text,
      html
    });
    await logEmail({ orderId: order.id, emailType: "listing_posted", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Listing posted email failed", err);
    await logEmail({ orderId: order.id, emailType: "listing_posted", recipient, subject, status: "failed" });
  }
}
