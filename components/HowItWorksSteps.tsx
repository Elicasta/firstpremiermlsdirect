import { ClipboardList, CreditCard, ContactRound, MailCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose Your Package",
    body: "Pick the flat fee MLS package that fits your needs."
  },
  {
    icon: CreditCard,
    title: "Pay Securely Online",
    body: "Complete your one-time package payment through Stripe."
  },
  {
    icon: ContactRound,
    title: "Send Your Contact Info",
    body: "Give us your name, phone, email, and the property address."
  },
  {
    icon: MailCheck,
    title: "John Sends the Forms",
    body: "John Duran will email the required listing forms and walk you through the next steps."
  }
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <Reveal
          key={step.title}
          delay={i * 100}
          as="li"
          className="group h-full rounded-lg bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <step.icon
              className="h-5 w-5 text-blue transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
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
