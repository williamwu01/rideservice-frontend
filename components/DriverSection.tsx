import { Clock, DollarSign, Star, Shield, TrendingUp, Smartphone } from "lucide-react";

const driverPerks = [
  {
    icon: Clock,
    title: "Your Schedule",
    description: "Drive on your own terms. Set your availability and manage trips through one simple interface.",
  },
  {
    icon: DollarSign,
    title: "Weekly Payments",
    description: "Get paid every week directly to your bank account. No waiting, no surprises.",
  },
  {
    icon: TrendingUp,
    title: "Your Earnings",
    description: "Keep more of what you earn. Loop charges lower fees than competitors so your income stays higher.",
  },
  {
    icon: Star,
    title: "Two-Way Ratings",
    description: "Rate passengers and be rated fairly. Our community accountability system keeps everyone honest.",
  },
  {
    icon: Shield,
    title: "Fully Supported",
    description: "24/7 driver support team available. We've got your back whenever you need help on the road.",
  },
  {
    icon: Smartphone,
    title: "One Dashboard",
    description: "Manage all your trips, earnings, messages, and reviews from one clean, intuitive app.",
  },
];

export default function DriverSection() {
  return (
    <section id="drive" className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Drive With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              Your Schedule,
              <br />
              Your Earnings.
            </h2>
            <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
              Join thousands of Canadian drivers who choose Loop for flexible
              hours, better pay, and a community they trust. Post your first
              trip in minutes.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#download"
                className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Start Driving
              </a>
              <a
                href="#how-it-works"
                className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/20">
              {[
                { value: "20+", label: "Cities" },
                { value: "4.9★", label: "Avg Rating" },
                { value: "Weekly", label: "Payouts" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-indigo-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – perks grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {driverPerks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/20 transition-colors"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm">{perk.title}</h3>
                  <p className="text-indigo-200 text-xs leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
