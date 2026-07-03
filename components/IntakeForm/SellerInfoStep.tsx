"use client";

export interface SellerInfoValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mailingAddress: string;
  isLegalOwner: "yes" | "no";
  coOwnerName: string;
  preferredContactMethod: "email" | "phone" | "text";
}

export function SellerInfoStep({
  values,
  onChange
}: {
  values: SellerInfoValues;
  onChange: (values: SellerInfoValues) => void;
}) {
  function set<K extends keyof SellerInfoValues>(key: K, value: SellerInfoValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="First Name">
        <input className="input" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} />
      </Field>
      <Field label="Last Name">
        <input className="input" value={values.lastName} onChange={(e) => set("lastName", e.target.value)} />
      </Field>
      <Field label="Email">
        <input className="input" type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
      </Field>
      <Field label="Phone">
        <input className="input" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>
      <Field label="Mailing Address" full>
        <input className="input" value={values.mailingAddress} onChange={(e) => set("mailingAddress", e.target.value)} />
      </Field>
      <Field label="Are you the legal owner?">
        <select className="input" value={values.isLegalOwner} onChange={(e) => set("isLegalOwner", e.target.value as "yes" | "no")}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </Field>
      <Field label="Co-owner name (if applicable)">
        <input className="input" value={values.coOwnerName} onChange={(e) => set("coOwnerName", e.target.value)} />
      </Field>
      <Field label="Preferred Contact Method" full>
        <select
          className="input"
          value={values.preferredContactMethod}
          onChange={(e) => set("preferredContactMethod", e.target.value as SellerInfoValues["preferredContactMethod"])}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="text">Text</option>
        </select>
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
