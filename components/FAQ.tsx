"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    category: "General",
    items: [
      {
        q: "What is RideLink?",
        a: "RideLink is a private pick-up and drop-off service based in Vancouver, BC. We provide dedicated, pre-booked rides so you always have a driver ready — no hailing, no waiting, no surge pricing.",
      },
      {
        q: "Where does RideLink operate?",
        a: "We currently serve Metro Vancouver, BC, including Vancouver, Burnaby, Richmond, Surrey, North Vancouver, Coquitlam, and surrounding areas. We are actively expanding to other Canadian provinces — stay tuned.",
      },
    ],
  },
  {
    category: "Booking",
    items: [
      {
        q: "How do I book a ride?",
        a: "You can book online using our booking form, or message us directly on WhatsApp. No app download needed. Enter your pickup location, destination, and date — we handle the rest.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes. Message us on WhatsApp as soon as possible if your plans change. Cancellations made well in advance can be fully refunded depending on timing.",
      },
    ],
  },
  {
    category: "FIFA 2026",
    items: [
      {
        q: "Why use RideLink during FIFA World Cup 2026?",
        a: "During FIFA 2026, Vancouver will be one of the busiest cities in Canada. Uber and taxis will be overwhelmed and hard to coordinate. RideLink gives you a pre-booked, private driver who shows up on time — no surge, no scramble.",
      },
      {
        q: "Do you service FIFA 2026 venues in Vancouver?",
        a: "Yes. We cover all FIFA 2026 match day venues and surrounding areas in Vancouver. Book in advance to guarantee your ride on match days.",
      },
    ],
  },
  {
    category: "Safety & Security",
    items: [
      {
        q: "How does RideLink verify drivers?",
        a: "Every RideLink driver is background-checked, licensed, and rated by real passengers. We maintain strict standards so you always ride with someone you can trust.",
      },
      {
        q: "What if I have an issue during my ride?",
        a: "Our support team is reachable via WhatsApp. All rides are tracked and logged. If anything goes wrong, contact us immediately and we will resolve it.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept payment via PayPal. Your fare is fixed and confirmed before your ride — no surprise charges on the day.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds are processed within 3-5 business days. Message us on WhatsApp or reach out through the contact form and we will take care of it.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <section id="faq" className="py-20 bg-white dark:bg-[#050B1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Everything you need to know about RideLink.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">
                {cat.category}
              </h3>
              <div className="space-y-2">
                {cat.items.map((item, idx) => {
                  const key = `${cat.category}-${idx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setOpenIndex(isOpen ? null : key)}
                      >
                        <span className="font-medium text-gray-900 dark:text-white text-sm pr-4">{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
