import { ShieldCheck, Award, Home, Camera } from "lucide-react";
import { Reveal } from "./Reveal";

const ITEMS = [
  { icon: Home, label: "Licensed Florida Real Estate Brokerage" },
  { icon: Award, label: "36+ Years of Experience" },
  { icon: ShieldCheck, label: "Flat Fee MLS Listing" },
  { icon: Camera, label: "Professional Photo Options Available" }
];

export function TrustBar() {
  return (
    <div className="bg-gray">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.label} delay={i * 75} className="flex flex-col items-center text-center gap-2">
            <item.icon className="h-6 w-6 text-gold" aria-hidden="true" />
            <p className="font-display text-xs font-bold uppercase tracking-wide text-navy">
              {item.label}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
