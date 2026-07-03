import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red/90",
  secondary: "bg-navy text-white hover:bg-navy/90",
  ghost: "bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white"
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 min-h-[48px] font-display font-bold uppercase tracking-wide text-sm transition-colors focus-ring";

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  showArrow = true
}: BaseProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
      {showArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  className = "",
  showArrow = false,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
      {showArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
