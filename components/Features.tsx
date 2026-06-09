"use client";

import ScrollReveal from "./ScrollReveal";

const features = [
  {
    icon: "⚡",
    title: "Instant Dispatch",
    desc: "Ride confirmed in under 60 seconds. Our system matches you with the nearest available driver automatically.",
    color: "#00a0dc",
  },
  {
    icon: "🏆",
    title: "FIFA 2026 Ready",
    desc: "Your dedicated driver to and from all Vancouver FIFA 2026 venues — when the city is at its busiest, we have you covered.",
    color: "#d4af37",
  },
  {
    icon: "🛡️",
    title: "Verified Drivers",
    desc: "Every driver is background-checked, licensed, and rated by real passengers. No exceptions.",
    color: "#00a0dc",
  },
  {
    icon: "💬",
    title: "SMS Booking",
    desc: "No app download needed. Book, track, and manage your ride entirely over text message.",
    color: "#4f46e5",
  },
  {
    icon: "💰",
    title: "Fixed Fare",
    desc: "Price is locked before you book. Zero surge pricing, even on match days.",
    color: "#d4af37",
  },
  {
    icon: "🌍",
    title: "Vancouver & Beyond",
    desc: "Currently serving Metro Vancouver, BC. Expanding to other Canadian provinces soon — stay tuned.",
    color: "#00a0dc",
  },
];

export default function Features() {
  return (
    <section id="about" className="bg-gray-50 dark:bg-[#070E1C] py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-3 block">
            Why RideLink
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Built for the World Cup
          </h2>
          <p className="text-gray-600 dark:text-gray-500 max-w-xl mx-auto">
            Premium rides engineered for the most watched sporting event on earth.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="group relative bg-white border border-gray-100 dark:bg-white/[0.03] dark:border-white/[0.07] rounded-2xl p-6 hover:border-gray-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-all duration-300">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: `${f.color}15`, boxShadow: `0 0 20px ${f.color}20` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}