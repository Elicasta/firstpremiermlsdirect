"use client";

import { useState } from "react";
import { PhotoUploader } from "@/components/PhotoUploader";

export default function UploadPhotosPage() {
  const [orderId, setOrderId] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl text-navy">Upload Photos</h1>
      <p className="mt-4 text-ink/70">
        Already started a listing? Enter your order ID from your confirmation email to upload
        or add photos.
      </p>

      {!confirmed ? (
        <div className="mt-6">
          <label className="block text-sm">
            <span className="font-semibold text-navy">Order ID</span>
            <input
              className="input mt-1"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 8f14e45f-ceea-4c9c..."
            />
          </label>
          <button
            className="mt-4 rounded-md bg-red px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white"
            onClick={() => orderId && setConfirmed(true)}
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <PhotoUploader orderId={orderId} maxFiles={40} onUploaded={() => {}} />
        </div>
      )}
    </section>
  );
}
