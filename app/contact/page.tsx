"use client";

import { useState } from "react";
import { contactFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Phone, MessageSquare, Mail, CalendarClock } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const result = contactFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data)
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Contact Us</h1>
      <p className="mt-4 text-ink/70">Need help choosing a package or have a question about your listing?</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="tel:3052330447"
          className="flex items-center gap-3 rounded-md border border-gray bg-white p-4 hover:border-blue"
        >
          <Phone className="h-5 w-5 text-blue" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-bold text-navy">Call</p>
            <p className="text-sm text-ink/60">305-233-0447</p>
          </div>
        </a>

        <a
          href="sms:3052330447"
          className="flex items-center gap-3 rounded-md border border-gray bg-white p-4 hover:border-blue"
        >
          <MessageSquare className="h-5 w-5 text-blue" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-bold text-navy">Text</p>
            <p className="text-sm text-ink/60">305-233-0447</p>
          </div>
        </a>

        <a
          href="mailto:orders@firstpremiermlsdirect.com"
          className="flex items-center gap-3 rounded-md border border-gray bg-white p-4 hover:border-blue"
        >
          <Mail className="h-5 w-5 text-blue" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-bold text-navy">Email</p>
            <p className="text-sm text-ink/60">orders@firstpremiermlsdirect.com</p>
          </div>
        </a>

        <button
          type="button"
          disabled
          title="Scheduling link coming soon"
          className="flex items-center gap-3 rounded-md border border-gray bg-white p-4 text-left opacity-60"
        >
          <CalendarClock className="h-5 w-5 text-ink/40" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-bold text-navy">Schedule a Call</p>
            <p className="text-sm text-ink/60">Coming soon</p>
          </div>
        </button>
      </div>

      {status === "success" ? (
        <div className="mt-8 rounded-lg bg-gray p-6">
          <p className="font-display font-bold text-navy">Message sent.</p>
          <p className="mt-1 text-sm text-ink/70">
            We'll get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy" htmlFor="name">Name</label>
            <input id="name" name="name" className="mt-1 w-full rounded-md border border-gray px-3 py-2 focus-ring" />
            {errors.name && <p className="mt-1 text-sm text-red">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="mt-1 w-full rounded-md border border-gray px-3 py-2 focus-ring" />
            {errors.email && <p className="mt-1 text-sm text-red">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy" htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" className="mt-1 w-full rounded-md border border-gray px-3 py-2 focus-ring" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy" htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} className="mt-1 w-full rounded-md border border-gray px-3 py-2 focus-ring" />
            {errors.message && <p className="mt-1 text-sm text-red">{errors.message}</p>}
          </div>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send Message"}
          </Button>
          {status === "error" && (
            <p className="text-sm text-red">Something went wrong. Please call us instead.</p>
          )}
        </form>
      )}
    </section>
  );
}
