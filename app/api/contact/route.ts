import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.ADMIN_ALERT_EMAIL ?? "orders@firstpremiermlsdirect.com",
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? "—"}\n\nMessage:\n${message}`
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form email failed", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
