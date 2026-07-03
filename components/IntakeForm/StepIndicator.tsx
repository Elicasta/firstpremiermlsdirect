const DEFAULT_STEPS = ["Seller Info", "Property Info", "Listing Copy", "Review", "Photos", "Sign Agreement"];

export function StepIndicator({ current, steps = DEFAULT_STEPS }: { current: number; steps?: string[] }) {
  return (
    <ol className="flex flex-wrap gap-2 text-xs font-display font-bold uppercase tracking-wide">
      {steps.map((label, i) => {
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
