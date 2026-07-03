import { ClipboardList, CreditCard, FileText, Camera, PenLine, Rocket } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose Your Package",
    body: "Pick the MLS package that fits your needs."
  },
  {
    icon: CreditCard,
    title: "Pay Online",
    body: "Pay your flat fee first, Amazon-checkout style. No property details needed yet."
  },
  {
    icon: FileText,
    title: "Submit Property Details",
    body: "Tell us your address, seller info, and listing copy right after payment."
  },
  {
    icon: Camera,
    title: "Upload or Schedule Photos",
    body: "Upload your own photos, or schedule a session if your package includes one."
  },
  {
    icon: PenLine,
    title: "Sign the Agreement",
    body: "Review and sign your listing agreement online."
  },
  {
    icon: Rocket,
    title: "Broker Review & MLS",
    body: "The broker reviews your submission, then your listing goes live on the MLS."
  }
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
