import { getResend, FROM_EMAIL } from "./resend";
import { createServiceRoleClient } from "./supabase/server";
import {
  adminAlertTemplate,
  clientConfirmationTemplate,
  missingInfoTemplate,
  listingPostedTemplate
} from "@/emails/templates";

// Each send* function fires the email via Resend AND writes a row to email_logs,
// so the admin dashboard has a full audit trail per order.

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

export async function sendAdminAlertEmail(order: any) {
  const { subject, text } = adminAlertTemplate({
    packageName: order.packages?.name ?? "Unknown package",
    amount: `$${order.total_amount}`,
    sellerName: `${order.sellers?.first_name} ${order.sellers?.last_name}`,
    sellerPhone: order.sellers?.phone,
    sellerEmail: order.sellers?.email,
    propertyAddress: order.properties?.property_address,
    photoCount: 0,
    agreementSigned: order.agreement_status === "signed",
    photoSessionNeeded: false
  });

  const recipient = process.env.ADMIN_ALERT_EMAIL ?? "orders@firstpremiermlsdirect.com";

  try {
    await getResend().emails.send({ from: FROM_EMAIL, to: recipient, subject, text });
    await logEmail({ orderId: order.id, emailType: "admin_alert", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Admin alert email failed", err);
    await logEmail({ orderId: order.id, emailType: "admin_alert", recipient, subject, status: "failed" });
  }
}

export async function sendClientConfirmationEmail(order: any) {
  const { subject, text } = clientConfirmationTemplate({
    firstName: order.sellers?.first_name,
    propertyAddress: order.properties?.property_address,
    packageName: order.packages?.name,
    orderId: order.id,
    portalLink: `${process.env.NEXT_PUBLIC_SITE_URL}/portal?order=${order.id}`
  });

  const recipient = order.sellers?.email;

  try {
    await getResend().emails.send({ from: FROM_EMAIL, to: recipient, subject, text });
    await logEmail({ orderId: order.id, emailType: "client_confirmation", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Client confirmation email failed", err);
    await logEmail({ orderId: order.id, emailType: "client_confirmation", recipient, subject, status: "failed" });
  }
}

export async function sendMissingInfoEmail(order: any, missingItems: string[]) {
  const { subject, text } = missingInfoTemplate({
    firstName: order.sellers?.first_name,
    propertyAddress: order.properties?.property_address,
    missingItems: missingItems.map((item) => `- ${item}`).join("\n"),
    portalLink: `${process.env.NEXT_PUBLIC_SITE_URL}/portal?order=${order.id}`
  });

  const recipient = order.sellers?.email;

  try {
    await getResend().emails.send({ from: FROM_EMAIL, to: recipient, subject, text });
    await logEmail({ orderId: order.id, emailType: "missing_info", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Missing info email failed", err);
    await logEmail({ orderId: order.id, emailType: "missing_info", recipient, subject, status: "failed" });
  }
}

export async function sendListingPostedEmail(order: any) {
  const { subject, text } = listingPostedTemplate({
    firstName: order.sellers?.first_name,
    propertyAddress: order.properties?.property_address,
    mlsNumber: order.mls_number ?? "",
    listingPrice: `$${order.properties?.listing_price}`,
    mlsLink: order.mls_link ?? "",
    publicLink: order.public_link ?? ""
  });

  const recipient = order.sellers?.email;

  try {
    await getResend().emails.send({ from: FROM_EMAIL, to: recipient, subject, text });
    await logEmail({ orderId: order.id, emailType: "listing_posted", recipient, subject, status: "sent" });
  } catch (err) {
    console.error("Listing posted email failed", err);
    await logEmail({ orderId: order.id, emailType: "listing_posted", recipient, subject, status: "failed" });
  }
}
