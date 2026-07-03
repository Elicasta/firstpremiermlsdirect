"use client";

import { useState } from "react";
import { contactFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";

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
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-4xl font-extrabold text-navy">Contact Us</h1>
      <p className="mt-4 text-ink/70">
        Questions about a package or your listing? Call{" "}
        <a href="tel:3052330447" className="font-semibold text-blue">
          305-233-0447
        </a>{" "}
        or send a message below.
      </p>

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
