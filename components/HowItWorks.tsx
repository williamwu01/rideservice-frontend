import { Search, ClipboardList, Globe, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Enter Your Route",
    description:
      'Tap the Search icon and enter your start and end location. You can add waypoints to pick up or drop off multiple passengers along the way.',
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Fill Trip Details",
    description:
      "Complete the trip information form — set your date, departure time, available seats, and price per seat. Add waypoints for flexible routes.",
  },
  {
    step: "03",
    icon: Globe,
    title: "Post Your Trip Live",
    description:
      "Your trip goes live instantly for passengers across Canada to find and book. Real-time notifications keep you updated on bookings.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Hit the Road",
    description:
      "You're all set! Loop assists you every step of the way with in-app messaging, GPS, and 24/7 support if you need anything.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Post a Trip in 4 Simple Steps
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Whether you&apos;re a driver posting a route or a rider searching for a seat,
            Loop makes it effortless.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl h-0.5 bg-indigo-100" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-xs font-bold">{step.step.replace("0", "")}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#download"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}
