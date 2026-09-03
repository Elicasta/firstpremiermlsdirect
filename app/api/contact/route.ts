import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { contactAlertTemplate } from "@/emails/templates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;
  const template = contactAlertTemplate({ name, email, phone, message });

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: process.env.ADMIN_ALERT_EMAIL ?? "Jduran238@bellsouth.net",
      replyTo: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form email failed", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
