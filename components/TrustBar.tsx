const ITEMS = [
  "Licensed Florida Real Estate Brokerage",
  "36+ Years of Experience",
  "Flat Fee MLS Listing",
  "Professional Photo Options Available"
];

export function TrustBar() {
  return (
    <div className="bg-gray">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center md:grid-cols-4">
        {ITEMS.map((item) => (
          <p key={item} className="font-display text-xs font-bold uppercase tracking-wide text-navy">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
