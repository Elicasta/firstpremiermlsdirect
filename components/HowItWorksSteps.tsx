import { ClipboardList, FileText, PenLine, Search, Rocket } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose Your Package",
    body: "Pick the MLS package that fits your needs."
  },
  {
    icon: FileText,
    title: "Submit Your Property Info",
    body: "Send your address, seller details, property description, showing instructions, and photos."
  },
  {
    icon: PenLine,
    title: "Sign the Listing Agreement",
    body: "Review and sign the required listing agreement online."
  },
  {
    icon: Search,
    title: "Broker Review",
    body: "Your information is reviewed before submission to the MLS."
  },
  {
    icon: Rocket,
    title: "Go Live",
    body: "Once everything is complete and approved, your listing is submitted for MLS activation."
  }
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 md:grid-cols-5">
      {STEPS.map((step, i) => (
        <Reveal key={step.title} delay={i * 100} as="li" className="group h-full rounded-lg bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-2">
            <step.icon className="h-5 w-5 text-blue transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            <span className="font-display text-2xl font-extrabold text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-2 font-display text-base font-bold text-navy">{step.title}</h3>
          <p className="mt-1 text-sm text-ink/70">{step.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
