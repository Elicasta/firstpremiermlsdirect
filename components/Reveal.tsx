"use client";

import { useEffect, useRef, useState } from "react";

// Fades + lifts content in as it enters the viewport. No animation library,
// just an IntersectionObserver and a CSS transition. Respects prefers-reduced-motion
// via the global rule in globals.css that kills transition-duration to ~0.
//
// `as` is deliberately narrowed to "div" | "li" instead of the full
// keyof JSX.IntrinsicElements. That full union is what broke the build: TypeScript
// tries to resolve every possible HTML element's prop set at once and gives up.
// We only ever render this as a div or a li, so there's no reason to pay that cost.
type Tag = "div" | "li";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div"
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = `transition-all duration-700 ease-out ${
    visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
  } ${className}`;
  const style = { transitionDelay: visible ? `${delay}ms` : "0ms" };

  if (as === "li") {
    return (
      <li ref={ref} className={classes} style={style}>
        {children}
      </li>
    );
  }

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
}
