"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    category: "General",
    items: [
      {
        q: "What is Loop Rideshare?",
        a: "Loop is Canada's trusted rideshare and carpool platform. It connects drivers with empty seats to passengers heading in the same direction, making travel more affordable, social, and eco-friendly.",
      },
      {
        q: "Which cities does Loop operate in?",
        a: "Loop currently operates in 20+ major Canadian cities including Toronto, Vancouver, Montreal, Calgary, Ottawa, Hamilton, London, Kitchener, Winnipeg, Halifax, and more.",
      },
    ],
  },
  {
    category: "Rider-Related",
    items: [
      {
        q: "How do I book a ride?",
        a: "Open the Loop app, enter your pickup and destination, choose a trip from available options, and confirm your booking. You'll receive real-time updates from your driver.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes, you can cancel a booking through the app. Cancellation policies vary by trip — check the specific trip details before booking.",
      },
    ],
  },
  {
    category: "Driver-Related",
    items: [
      {
        q: "How do I become a Loop driver?",
        a: "Download the Loop app, create a driver profile, complete ID verification and background check, and post your first trip. The whole process takes less than 30 minutes.",
      },
      {
        q: "How much can I earn as a driver?",
        a: "Earnings vary by route and frequency. Loop charges lower fees than competitors, so drivers keep more of every fare. Payments are made weekly directly to your bank account.",
      },
    ],
  },
  {
    category: "Safety & Security",
    items: [
      {
        q: "How does Loop verify drivers?",
        a: "All drivers undergo ID verification and criminal background checks before being approved on the platform. Real-time GPS tracking and two-way ratings keep both parties accountable.",
      },
      {
        q: "What if I feel unsafe during a trip?",
        a: "The app has an emergency button that contacts local authorities. Our 24/7 support team is always available, and all trips are GPS-tracked for your safety.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "Loop accepts all major credit and debit cards, plus in-app Loop Coins for discounts. All transactions are processed securely through the app.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds are processed within 3-5 business days depending on your bank. Contact support@looprideshare.com for any payment disputes.",
      },
    ],
  },
  {
    category: "Package Delivery",
    items: [
      {
        q: "How does Loop Delivery work?",
        a: "Drivers with available space can accept package delivery requests along their route. Senders drop off a package, and it's delivered same-day to the recipient in the destination city.",
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
            Everything you need to know about Loop Rideshare.
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
