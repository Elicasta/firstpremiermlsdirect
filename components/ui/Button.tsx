import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red/90",
  secondary: "bg-navy text-white hover:bg-navy/90",
  ghost: "bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white"
};

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 font-display font-bold uppercase tracking-wide text-sm transition-colors focus-ring";

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = ""
}: BaseProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
