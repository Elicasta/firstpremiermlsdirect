"use client";

export interface PropertyInfoValues {
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  lotSize: string;
  yearBuilt: string;
  hoa: "yes" | "no";
  hoaAmount: string;
  propertyTaxes: string;
  occupancyStatus: string;
  desiredListingPrice: string;
  buyerAgentCompensation: string;
  showingInstructions: string;
  lockboxDetails: string;
  gateAccess: string;
}

export function PropertyInfoStep({
  values,
  onChange
}: {
  values: PropertyInfoValues;
  onChange: (values: PropertyInfoValues) => void;
}) {
  function set<K extends keyof PropertyInfoValues>(key: K, value: PropertyInfoValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Property Address" full>
        <input className="input" value={values.propertyAddress} onChange={(e) => set("propertyAddress", e.target.value)} />
      </Field>
      <Field label="City">
        <input className="input" value={values.city} onChange={(e) => set("city", e.target.value)} />
      </Field>
      <Field label="State">
        <input className="input" maxLength={2} value={values.state} onChange={(e) => set("state", e.target.value.toUpperCase())} />
      </Field>
      <Field label="Zip">
        <input className="input" value={values.zip} onChange={(e) => set("zip", e.target.value)} />
      </Field>
      <Field label="Property Type">
        <select className="input" value={values.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
          <option value="">Select...</option>
          <option value="single_family">Single Family</option>
          <option value="condo">Condo</option>
          <option value="townhouse">Townhouse</option>
          <option value="multi_family">Multi-Family</option>
          <option value="land">Land</option>
        </select>
      </Field>
      <Field label="Bedrooms">
        <input className="input" type="number" value={values.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
      </Field>
      <Field label="Bathrooms">
        <input className="input" type="number" step="0.5" value={values.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
      </Field>
      <Field label="Square Footage">
        <input className="input" type="number" value={values.squareFeet} onChange={(e) => set("squareFeet", e.target.value)} />
      </Field>
      <Field label="Lot Size">
        <input className="input" value={values.lotSize} onChange={(e) => set("lotSize", e.target.value)} />
      </Field>
      <Field label="Year Built">
        <input className="input" type="number" value={values.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} />
      </Field>
      <Field label="HOA?">
        <select className="input" value={values.hoa} onChange={(e) => set("hoa", e.target.value as "yes" | "no")}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>
      {values.hoa === "yes" && (
        <Field label="HOA Amount">
          <input className="input" type="number" value={values.hoaAmount} onChange={(e) => set("hoaAmount", e.target.value)} />
        </Field>
      )}
      <Field label="Property Taxes (annual)">
        <input className="input" type="number" value={values.propertyTaxes} onChange={(e) => set("propertyTaxes", e.target.value)} />
      </Field>
      <Field label="Occupancy Status">
        <select className="input" value={values.occupancyStatus} onChange={(e) => set("occupancyStatus", e.target.value)}>
          <option value="">Select...</option>
          <option value="owner_occupied">Owner Occupied</option>
          <option value="tenant_occupied">Tenant Occupied</option>
          <option value="vacant">Vacant</option>
        </select>
      </Field>
      <Field label="Desired Listing Price">
        <input className="input" type="number" value={values.desiredListingPrice} onChange={(e) => set("desiredListingPrice", e.target.value)} />
      </Field>
      <Field label="Buyer Agent Compensation (if applicable)">
        <input className="input" value={values.buyerAgentCompensation} onChange={(e) => set("buyerAgentCompensation", e.target.value)} />
      </Field>
      <Field label="Showing Instructions" full>
        <textarea className="input" rows={3} value={values.showingInstructions} onChange={(e) => set("showingInstructions", e.target.value)} />
      </Field>
      <Field label="Lockbox Details (if applicable)">
        <input className="input" value={values.lockboxDetails} onChange={(e) => set("lockboxDetails", e.target.value)} />
      </Field>
      <Field label="Gate/Access Instructions">
        <input className="input" value={values.gateAccess} onChange={(e) => set("gateAccess", e.target.value)} />
      </Field>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-semibold text-navy">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
