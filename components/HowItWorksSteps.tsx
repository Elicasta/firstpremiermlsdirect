const STEPS = [
  {
    title: "Choose Your Package",
    body: "Pick the MLS package that fits your needs."
  },
  {
    title: "Submit Your Property Info",
    body: "Send your address, seller details, property description, showing instructions, and photos."
  },
  {
    title: "Sign the Listing Agreement",
    body: "Review and sign the required listing agreement online."
  },
  {
    title: "Broker Review",
    body: "Your information is reviewed before submission to the MLS."
  },
  {
    title: "Go Live",
    body: "Once everything is complete and approved, your listing is submitted for MLS activation."
  }
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-6 md:grid-cols-5">
      {STEPS.map((step, i) => (
        <li key={step.title} className="rounded-lg bg-white p-5 shadow-sm">
          <span className="font-display text-3xl font-extrabold text-gold">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-display text-base font-bold text-navy">{step.title}</h3>
          <p className="mt-1 text-sm text-ink/70">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
