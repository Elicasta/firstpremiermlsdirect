"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function AgreementSigner({
  orderId,
  onSigned
}: {
  orderId: string;
  onSigned: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [signingUrl, setSigningUrl] = useState<string | null>(null);

  async function handleSendAgreement() {
    setStatus("sending");
    try {
      const res = await fetch("/api/agreement/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSigningUrl(data.signingUrl);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-lg border border-gray bg-white p-6">
      <h3 className="font-display font-bold text-navy">Sign Your Listing Agreement</h3>
      <p className="mt-2 text-sm text-ink/70">
        You'll review and sign your flat fee MLS listing agreement online. Once signed, we'll
        move on to payment.
      </p>

      {status !== "sent" ? (
        <Button className="mt-4" onClick={handleSendAgreement} disabled={status === "sending"}>
          {status === "sending" ? "Preparing agreement..." : "Review & Sign Agreement"}
        </Button>
      ) : (
        <div className="mt-4">
          <a
            href={signingUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-blue underline"
          >
            Open agreement to sign →
          </a>
          <p className="mt-2 text-sm text-ink/60">
            Signed it already?{" "}
            <button className="text-blue underline focus-ring" onClick={onSigned}>
              Continue to payment
            </button>
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red">
          Couldn't prepare the agreement. Call 305-233-0447 and we'll help you finish this step.
        </p>
      )}
    </div>
  );
}
