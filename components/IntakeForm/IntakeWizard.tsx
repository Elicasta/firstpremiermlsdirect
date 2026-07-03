"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PACKAGES, ADDONS } from "@/lib/packages";
import { StepIndicator } from "./StepIndicator";
import { SellerInfoStep, SellerInfoValues } from "./SellerInfoStep";
import { PropertyInfoStep, PropertyInfoValues } from "./PropertyInfoStep";
import { ListingCopyStep, ListingCopyValues } from "./ListingCopyStep";
import { PhotosStep, PhotosValues } from "./PhotosStep";
import { ReviewStep } from "./ReviewStep";
import { AgreementSigner } from "../AgreementSigner";
import { Button } from "../ui/Button";
import { UploadedFile } from "../PhotoUploader";

const emptySeller: SellerInfoValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  mailingAddress: "",
  isLegalOwner: "yes",
  coOwnerName: "",
  preferredContactMethod: "email"
};

const emptyProperty: PropertyInfoValues = {
  propertyAddress: "",
  city: "",
  state: "FL",
  zip: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  lotSize: "",
  yearBuilt: "",
  hoa: "no",
  hoaAmount: "",
  propertyTaxes: "",
  occupancyStatus: "",
  desiredListingPrice: "",
  buyerAgentCompensation: "",
  showingInstructions: "",
  lockboxDetails: "",
  gateAccess: ""
};

const emptyListingCopy: ListingCopyValues = {
  propertyHighlights: "",
  upgrades: "",
  appliancesIncluded: "",
  parking: "",
  communityFeatures: "",
  schoolInfo: "",
  exclusions: ""
};

const emptyPhotos: PhotosValues = {
  method: "schedule",
  requestedDates: "",
  bestTimeOfDay: "",
  accessNotes: ""
};

export function IntakeWizard({ initialPackageSlug }: { initialPackageSlug?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [packageSlug, setPackageSlug] = useState(initialPackageSlug ?? "standard");
  const [seller, setSeller] = useState(emptySeller);
  const [property, setProperty] = useState(emptyProperty);
  const [listingCopy, setListingCopy] = useState(emptyListingCopy);
  const [photos, setPhotos] = useState(emptyPhotos);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pkg = PACKAGES.find((p) => p.slug === packageSlug) ?? PACKAGES[1];

  function next() {
    setStep((s) => Math.min(s + 1, 6));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  // Creates the order (seller + property + order rows) once the seller reaches the review step,
  // so an orderId exists before sending the agreement and starting Stripe checkout.
  async function ensureOrderCreated() {
    if (orderId) return orderId;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug,
          seller,
          property,
          listingCopy,
          photos,
          selectedAddons
        })
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      setOrderId(data.orderId);
      return data.orderId as string;
    } catch (err) {
      setSubmitError("We couldn't save your listing details. Please try again or call 305-233-0447.");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReachReview() {
    await ensureOrderCreated();
    next();
  }

  async function handleAgreementSigned() {
    if (!orderId) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, packageSlug, selectedAddons })
    });
    if (res.ok) {
      const data = await res.json();
      window.location.href = data.checkoutUrl;
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={step} />

      <div className="mt-8 rounded-lg border border-gray bg-white p-6">
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Choose Your Package</h2>
            <div className="mt-4 grid gap-3">
              {PACKAGES.map((p) => (
                <label
                  key={p.slug}
                  className={`flex cursor-pointer items-center justify-between rounded-md border p-4 ${
                    packageSlug === p.slug ? "border-red bg-red/5" : "border-gray"
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-navy">{p.name}</p>
                    <p className="text-sm text-ink/60">{p.positioning}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-extrabold text-red">${p.price}</span>
                    <input
                      type="radio"
                      checked={packageSlug === p.slug}
                      onChange={() => setPackageSlug(p.slug)}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <p className="font-semibold text-navy">Add-ons (optional)</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {ADDONS.map((addon) => (
                  <label key={addon.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={(e) =>
                        setSelectedAddons((prev) =>
                          e.target.checked ? [...prev, addon.id] : prev.filter((a) => a !== addon.id)
                        )
                      }
                    />
                    {addon.name} (+${addon.price})
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Seller Info</h2>
            <div className="mt-4">
              <SellerInfoStep values={seller} onChange={setSeller} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Property Info</h2>
            <div className="mt-4">
              <PropertyInfoStep values={property} onChange={setProperty} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Listing Copy</h2>
            <div className="mt-4">
              <ListingCopyStep values={listingCopy} onChange={setListingCopy} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Photos</h2>
            <div className="mt-4">
              <PhotosStep
                values={photos}
                onChange={setPhotos}
                orderId={orderId ?? "pending"}
                maxFiles={pkg.photo_limit}
                includesPhotography={pkg.includes_photography}
                onUploaded={setUploadedFiles}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-navy">Review &amp; Sign</h2>
            <ReviewStep pkg={pkg} seller={seller} property={property} addons={selectedAddons} />
            {orderId ? (
              <AgreementSigner orderId={orderId} onSigned={handleAgreementSigned} />
            ) : (
              <p className="text-sm text-red">{submitError ?? "Preparing your order..."}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 1}>
          Back
        </Button>
        {step < 5 && (
          <Button onClick={next}>Continue</Button>
        )}
        {step === 5 && (
          <Button onClick={handleReachReview} disabled={submitting}>
            {submitting ? "Saving..." : "Continue to Review"}
          </Button>
        )}
      </div>
    </div>
  );
}
