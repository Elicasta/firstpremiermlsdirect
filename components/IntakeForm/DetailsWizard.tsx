"use client";

import { useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { SellerInfoStep, SellerInfoValues } from "./SellerInfoStep";
import { PropertyInfoStep, PropertyInfoValues } from "./PropertyInfoStep";
import { ListingCopyStep, ListingCopyValues } from "./ListingCopyStep";
import { PhotosStep, PhotosValues } from "./PhotosStep";
import { ReviewStep } from "./ReviewStep";
import { AgreementSigner } from "../AgreementSigner";
import { Button } from "../ui/Button";
import { UploadedFile } from "../PhotoUploader";
import { Package } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

const STEPS = ["Seller Info", "Property Info", "Listing Copy", "Review", "Photos", "Sign Agreement"];

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

export function DetailsWizard({ orderId, pkg, addons }: { orderId: string; pkg: Package; addons: string[] }) {
  const [step, setStep] = useState(1);
  const [seller, setSeller] = useState(emptySeller);
  const [property, setProperty] = useState(emptyProperty);
  const [listingCopy, setListingCopy] = useState(emptyListingCopy);
  const [photos, setPhotos] = useState(emptyPhotos);
  const [, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submittingDetails, setSubmittingDetails] = useState(false);
  const [submittingPhotos, setSubmittingPhotos] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function next() {
    setStep((s) => Math.min(s + 1, 6));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  // Fires once, when the seller moves past Review. This is the point where the seller
  // and property rows actually get written — real order, real seller, real property,
  // all before a single photo gets uploaded.
  async function handleSubmitDetails() {
    setSubmittingDetails(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller, property, listingCopy })
      });
      if (!res.ok) throw new Error("Failed to save your listing details");
      next();
    } catch {
      setSubmitError("We couldn't save your details. Please try again or call 305-233-0447.");
    } finally {
      setSubmittingDetails(false);
    }
  }

  async function handleContinuePastPhotos() {
    setSubmittingPhotos(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photos)
      });
      if (!res.ok) throw new Error("Failed to save photo info");
      next();
    } catch {
      setSubmitError("We couldn't save that. Please try again or call 305-233-0447.");
    } finally {
      setSubmittingPhotos(false);
    }
  }

  function handleAgreementSigned() {
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-gray bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-blue" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">
          Your listing is with the broker.
        </h2>
        <p className="mt-2 text-ink/70">
          Everything's in. The broker will review your submission and get your listing ready
          for the MLS. Most completed listings are submitted within 48 hours after all required
          information, payment, signed documents, and usable photos are received.
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
        <a href={`/portal?order=${orderId}`} className="mt-4 inline-block font-display font-bold text-blue underline">
          Check your listing status →
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={step} steps={STEPS} />

      <div className="mt-8 rounded-lg border border-gray bg-white p-6">
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Seller Info</h2>
            <div className="mt-4">
              <SellerInfoStep values={seller} onChange={setSeller} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Property Info</h2>
            <div className="mt-4">
              <PropertyInfoStep values={property} onChange={setProperty} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Listing Copy</h2>
            <div className="mt-4">
              <ListingCopyStep values={listingCopy} onChange={setListingCopy} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-bold text-navy">Review</h2>
            <div className="mt-4">
              <ReviewStep pkg={pkg} seller={seller} property={property} addons={addons} />
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
                orderId={orderId}
                maxFiles={pkg.photo_limit}
                includesPhotography={pkg.includes_photography}
                onUploaded={setUploadedFiles}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-navy">Sign Agreement</h2>
            <AgreementSigner orderId={orderId} onSigned={handleAgreementSigned} />
          </div>
        )}

        {submitError && <p className="mt-4 text-sm text-red">{submitError}</p>}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 1 || step === 6}>
          Back
        </Button>
        {step < 4 && <Button onClick={next}>Continue</Button>}
        {step === 4 && (
          <Button onClick={handleSubmitDetails} disabled={submittingDetails}>
            {submittingDetails ? "Saving..." : "Confirm & Continue"}
          </Button>
        )}
        {step === 5 && (
          <Button onClick={handleContinuePastPhotos} disabled={submittingPhotos}>
            {submittingPhotos ? "Saving..." : "Continue to Agreement"}
          </Button>
        )}
      </div>
    </div>
  );
}
