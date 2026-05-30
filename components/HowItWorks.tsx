"use client";

import ScrollReveal from "./ScrollReveal";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Enter Your Route",
    desc: "Type your pickup and destination — shorthands like YVR or BC Place work too. Get an instant fixed fare.",
    color: "#00a0dc",
  },
  {
    num: "02",
    title: "Confirm Your Details",
    desc: "Add your name, WhatsApp number, and pickup time. No account needed.",
    color: "#d4af37",
  },
  {
    num: "03",
    title: "Pay Securely",
    desc: "Complete payment via PayPal. Your fare is locked — no surprises on match day.",
    color: "#00a0dc",
  },
  {
    num: "04",
    title: "Your Driver Arrives",
    desc: "Get driver details over WhatsApp. Track in real time and ride in comfort.",
    color: "#d4af37",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#050B1A] py-24 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-3 block">How It Works</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Four Steps to Your Ride</h2>
          <p className="text-gray-500 max-w-md mx-auto">From booking to drop-off in minutes.</p>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[calc(2.5rem)] top-0 bottom-0 w-px bg-white/5 hidden sm:block" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1} direction="left">
                <div className="flex gap-6 items-start">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 relative z-10"
                    style={{ backgroundColor: `${step.color}20`, border: `1px solid ${step.color}40`, color: step.color }}
                  >
                    {step.num}
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex-1 hover:border-white/15 transition-colors">
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={0.4} className="text-center mt-12">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#c9a227] text-black font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            Book Your Ride
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}