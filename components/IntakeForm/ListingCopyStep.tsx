"use client";

export interface ListingCopyValues {
  propertyHighlights: string;
  upgrades: string;
  appliancesIncluded: string;
  parking: string;
  communityFeatures: string;
  schoolInfo: string;
  exclusions: string;
}

export function ListingCopyStep({
  values,
  onChange
}: {
  values: ListingCopyValues;
  onChange: (values: ListingCopyValues) => void;
}) {
  function set<K extends keyof ListingCopyValues>(key: K, value: ListingCopyValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-4">
      <Field label="Property Highlights">
        <textarea className="input" rows={3} value={values.propertyHighlights} onChange={(e) => set("propertyHighlights", e.target.value)} />
      </Field>
      <Field label="Upgrades">
        <textarea className="input" rows={2} value={values.upgrades} onChange={(e) => set("upgrades", e.target.value)} />
      </Field>
      <Field label="Appliances Included">
        <input className="input" value={values.appliancesIncluded} onChange={(e) => set("appliancesIncluded", e.target.value)} />
      </Field>
      <Field label="Parking / Garage">
        <input className="input" value={values.parking} onChange={(e) => set("parking", e.target.value)} />
      </Field>
      <Field label="Community Features">
        <input className="input" value={values.communityFeatures} onChange={(e) => set("communityFeatures", e.target.value)} />
      </Field>
      <Field label="School Info (optional)">
        <input className="input" value={values.schoolInfo} onChange={(e) => set("schoolInfo", e.target.value)} />
      </Field>
      <Field label="Anything Excluded from Sale">
        <input className="input" value={values.exclusions} onChange={(e) => set("exclusions", e.target.value)} />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-navy">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
