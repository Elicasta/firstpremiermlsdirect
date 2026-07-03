"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "./ui/Button";

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About the Broker" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-brand text-xl tracking-wide">
          First Premier <span className="text-gold">MLS Direct</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-sm font-semibold uppercase tracking-wide hover:text-gold focus-ring"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/start-listing" variant="primary">
            Start My Listing
          </ButtonLink>
        </nav>

        <button
          className="md:hidden focus-ring"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-6 bg-white mb-1" />
          <span className="block h-0.5 w-6 bg-white mb-1" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 font-display text-sm font-semibold uppercase tracking-wide"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/start-listing" variant="primary" className="mt-2 text-center">
            Start My Listing
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
