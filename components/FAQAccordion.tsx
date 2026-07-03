"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is flat-fee MLS?",
    a: "Flat-fee MLS means you pay one upfront fee to get your property listed on the MLS, instead of paying a percentage-based listing commission. You still handle the sale process yourself."
  },
  {
    q: "Am I still selling the home myself?",
    a: "Yes. You remain the point of contact for showings and negotiations unless you make other arrangements. We get your listing live and accurate on the MLS."
  },
  {
    q: "Do I have to pay a buyer's agent?",
    a: "That depends on what you decide to offer. You can set your buyer agent compensation, if any, during the intake process."
  },
  {
    q: "How fast will my listing go live?",
    a: "Most completed listings are submitted within 48 hours after all required information, payment, signed documents, and usable photos are received."
  },
  {
    q: "What happens after I pay?",
    a: "We confirm your order by email, review your submission, and prepare your listing for MLS entry once your agreement, property details, and photos are complete."
  },
  {
    q: "What photos do I need?",
    a: "That depends on your package. Basic requires seller-uploaded photos. Standard and Premium include a professional photo shoot by EC Creative Studios."
  },
  {
    q: "Can I make changes after listing?",
    a: "Yes, within the edit limit of your package. Basic does not include edits beyond corrections. Standard includes up to 2 edits. Premium includes up to 5."
  },
  {
    q: "Is photography included?",
    a: "Photography is included with the Standard and Premium packages. Basic Package sellers upload their own photos."
  },
  {
    q: "What if my listing information is incomplete?",
    a: "We'll email you with exactly what's missing and a link to complete it. Your listing won't move to MLS submission until everything required is received."
  },
  {
    q: "What happens when my home sells?",
    a: "Let us know so we can update or close out your listing. Reach out through the client portal or by phone."
  },
  {
    q: "Can I cancel?",
    a: "Contact us as soon as possible. Refund eligibility depends on how far your listing has progressed — see our Terms of Service for details."
  },
  {
    q: "What areas of Florida do you serve?",
    a: "We work with sellers across Florida through the MLS. Contact us with your property location if you have questions about local MLS coverage."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray rounded-lg bg-white shadow-sm">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="font-display font-bold text-navy">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 text-red transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && <p className="px-5 pb-4 text-sm text-ink/70">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
