"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this legal?",
    a: "First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a licensed Florida real estate brokerage. John Duran is the broker, license 0512688, and the office license is CQ1025438. Flat fee MLS service is offered through the licensed brokerage."
  },
  {
    q: "Why is this so affordable?",
    a: "Because you're buying a defined flat fee MLS service instead of a traditional full-service listing arrangement priced as a percentage of the sale. You handle more of the sale yourself, while the brokerage handles the MLS listing services included in your package."
  },
  {
    q: "Do I still work with agents?",
    a: "You may. Buyers can still be represented by their own real estate agents. Any buyer-agent compensation or other transaction terms are handled separately and should be discussed with the broker as part of your listing paperwork."
  },
  {
    q: "Do I pay a listing commission?",
    a: "You pay the flat fee shown for your selected package instead of a traditional percentage-based listing commission to First Premier MLS Direct. Other transaction costs or compensation may still apply depending on your sale and the terms you agree to."
  },
  {
    q: "Am I selling the home myself?",
    a: "This service is designed for sellers who want to handle more of the sale themselves. The exact responsibilities of the seller and brokerage will be explained in the listing documents John Duran sends after your purchase."
  },
  {
    q: "Who is the broker behind First Premier MLS Direct?",
    a: "John Duran is the Broker of First Premier Real Estate Services, Inc. He has more than 36 years of real estate experience. Broker License: 0512688. Office License: CQ1025438."
  },
  {
    q: "What does the broker do?",
    a: "John and the brokerage review the required listing information and documents, make sure the listing is prepared for the applicable MLS, and perform the MLS services included in the package you purchased."
  },
  {
    q: "What is flat fee MLS?",
    a: "Flat fee MLS means you pay a set upfront package price for the MLS listing services described on this site rather than paying First Premier MLS Direct a traditional percentage-based listing commission."
  },
  {
    q: "What happens after I pay?",
    a: "You'll be taken to a short form asking for your name, phone number, email, and property address. Once you submit it, John Duran will be notified and will email the required listing forms and next steps directly from the brokerage."
  },
  {
    q: "How fast will my listing go live?",
    a: "Most completed listings are submitted within 48 hours after all required information, payment, signed documents, usable photos, and any other items requested by the broker have been received and approved."
  },
  {
    q: "What photos do I need?",
    a: "That depends on your package. The Basic package uses seller-provided photos. Standard and Premium include professional photography as described on the pricing page. John will coordinate the required photo steps with you after purchase."
  },
  {
    q: "Can I make changes after listing?",
    a: "Yes, subject to the edit allowance in your package and applicable MLS rules. Basic includes corrections only, Standard includes up to 2 listing edits, and Premium includes up to 5."
  },
  {
    q: "Is photography included?",
    a: "Photography is included with the Standard and Premium packages. The Basic package uses seller-provided photos."
  },
  {
    q: "What if my information is incomplete?",
    a: "John or the brokerage will contact you with the missing items. The listing will not be submitted to the MLS until the required information and documents have been received and approved."
  },
  {
    q: "What happens when my home sells?",
    a: "Contact First Premier Real Estate Services, Inc. so the brokerage can handle the required MLS status updates and closing-related listing steps."
  },
  {
    q: "Can I cancel after paying?",
    a: "Yes, but refund eligibility depends on whether brokerage work has started and whether the listing has already been submitted to the MLS. A full refund may be available before brokerage work begins. Once MLS submission has occurred, the package fee is non-refundable. See the Refund Policy page for the full terms."
  },
  {
    q: "What areas of Florida do you serve?",
    a: "Coverage depends on the applicable MLS and property location. Contact us with the property address if you want to confirm coverage before purchasing."
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
