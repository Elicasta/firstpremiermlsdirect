"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-navy text-white transition-shadow ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
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
          <ButtonLink href="/start-listing" variant="primary" className="px-5 py-2.5 min-h-0">
            Start My Listing
          </ButtonLink>
        </nav>

        <button
          className="focus-ring md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <nav
        className={`flex flex-col gap-1 overflow-hidden border-t border-white/10 px-4 transition-all duration-300 md:hidden ${
          open ? "max-h-96 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
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
        <ButtonLink href="/start-listing" variant="primary" className="mt-2 justify-center">
          Start My Listing
        </ButtonLink>
      </nav>
    </header>
  );
}
