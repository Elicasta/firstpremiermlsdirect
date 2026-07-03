"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this legal?",
    a: "Yes. First Premier MLS Direct is a service of First Premier Real Estate Services, Inc., a licensed Florida real estate brokerage. Flat fee MLS listing is a standard, legal alternative to a traditional full-commission listing."
  },
  {
    q: "Why is this so cheap?",
    a: "Because you're paying for MLS entry and broker oversight, not for a full-service agent to run your entire sale. A traditional listing agent handles showings, negotiation, and marketing for a percentage of your sale price. Here, you handle those parts yourself and pay one flat fee for MLS exposure instead."
  },
  {
    q: "Do I still work with agents?",
    a: "You may. Buyers often come with their own agent, and that agent represents the buyer, not you. You can choose whether to offer that agent compensation. First Premier Real Estate Services, Inc. is your listing broker of record, not a traditional full-service listing agent."
  },
  {
    q: "Do I pay commission?",
    a: "You pay one flat fee for your package, not a percentage-based listing commission. You may choose to offer compensation to a buyer's agent if one is involved, but that's your decision, not a fee to us."
  },
  {
    q: "Am I selling the home myself?",
    a: "Yes. You handle showings, buyer questions, and negotiations unless you arrange otherwise. We handle getting your listing entered into the MLS accurately and reviewed by the broker."
  },
  {
    q: "What does the broker actually do?",
    a: "The broker reviews your submitted property details, disclosures, and photos for accuracy and MLS compliance, then submits your listing to the MLS under the brokerage's license. That review is what makes this a licensed, legitimate MLS listing instead of just a listing site."
  },
  {
    q: "What is flat-fee MLS?",
    a: "Flat-fee MLS means you pay one upfront fee to get your property listed on the MLS, instead of paying a percentage-based listing commission. You still handle the sale process yourself."
  },
  {
    q: "How fast will my listing go live?",
    a: "Most completed listings are submitted within 48 hours after all required information, payment, signed documents, and usable photos are received."
  },
  {
    q: "What happens after I pay?",
    a: "You'll submit your property details, upload or schedule photos, and sign your listing agreement. Once everything is in, the broker reviews it and prepares your listing for MLS entry."
  },
  {
    q: "What photos do I need?",
    a: "That depends on your package. Basic requires seller-uploaded photos. Standard and Premium include a professional photo shoot."
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
    q: "Can I cancel after paying?",
    a: "Yes, contact us as soon as possible. A full refund is available before you submit your property details. After that, refund eligibility depends on how far your listing has progressed. See our Refund Policy for the exact breakdown."
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
