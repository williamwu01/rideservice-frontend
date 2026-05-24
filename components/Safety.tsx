import { ShieldCheck, MapPin, Phone, Lock, Star, Clock } from "lucide-react";

const safetyFeatures = [
  {
    icon: ShieldCheck,
    title: "ID Verification & Background Checks",
    description:
      "Every driver on Loop is verified with government-issued ID and undergoes criminal background screening before their first trip.",
  },
  {
    icon: MapPin,
    title: "Real-Time GPS Tracking",
    description:
      "Every trip is tracked live so you always know where you are. Share your trip status with friends or family for extra peace of mind.",
  },
  {
    icon: Phone,
    title: "24/7 Customer Support",
    description:
      "Our support team is available around the clock. Whether you're mid-trip or planning ahead, help is always one tap away.",
  },
  {
    icon: Lock,
    title: "In-App Privacy Protection",
    description:
      "Your personal contact details are never shared. All communication happens within the Loop app, keeping your data secure.",
  },
  {
    icon: Star,
    title: "Two-Way Rating System",
    description:
      "After every trip, both drivers and riders rate each other. This community accountability system ensures high standards across the platform.",
  },
  {
    icon: Clock,
    title: "Trip History & Records",
    description:
      "Full records of every trip are stored securely. Review past rides, receipts, and communications anytime from your profile.",
  },
];

export default function Safety() {
  return (
    <section id="safety" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Safety First
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Your Safety Is Our Top Priority
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Loop is built with safety at its core. From driver verification to
            real-time tracking, every feature is designed to keep you protected.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-4 p-6 border border-gray-100 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
