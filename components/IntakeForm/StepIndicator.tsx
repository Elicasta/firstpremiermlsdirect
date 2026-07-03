const STEPS = ["Package", "Seller Info", "Property Info", "Listing Copy", "Photos", "Review & Sign"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap gap-2 text-xs font-display font-bold uppercase tracking-wide">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return (
          <li
            key={label}
            className={`rounded-full px-3 py-1 ${
              active
                ? "bg-red text-white"
                : done
                ? "bg-navy text-white"
                : "bg-gray text-ink/50"
            }`}
          >
            {step}. {label}
          </li>
        );
      })}
    </ol>
  );
}
