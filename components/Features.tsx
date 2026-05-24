import {
  Search,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Gift,
  Package,
  Users,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Ride Search Made Simple",
    description:
      "Find rides instantly with our smart search. Filter by date, seats, price, and route to get the perfect trip.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Calendar,
    title: "Seamless Ride Booking",
    description:
      "Book your seat in seconds. Schedule recurring trips or book on-demand — flexibility is built in.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: MessageCircle,
    title: "In-App Messaging",
    description:
      "Communicate directly with drivers or passengers without sharing personal contact information.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified Drivers & Riders",
    description:
      "Every driver undergoes ID verification and background checks. Ride with confidence every time.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Gift,
    title: "Refer & Earn (Loop Coins)",
    description:
      "Invite friends and earn Loop Coins for every referral. Redeem coins for discounts on future rides.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Package,
    title: "Package Delivery",
    description:
      "Send packages along driver routes. Same-day delivery across cities at a fraction of courier costs.",
    color: "bg-orange-100 text-orange-600",
    badge: "NEW",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Connect with fellow riders in your city. Share tips, routes, and build a trusted travel network.",
    color: "bg-pink-100 text-pink-600",
    badge: "NEW",
  },
  {
    icon: LayoutDashboard,
    title: "Redesigned Home Screen",
    description:
      "A refreshed, intuitive interface makes finding and booking rides faster and more enjoyable than ever.",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function Features() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Everything You Need to Ride Smarter
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Loop is packed with features that make carpooling safe, affordable,
            and enjoyable for everyone across Canada.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {feature.badge && (
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
