"use client";

import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const cities = [
  { name: "Toronto", province: "ON", routes: 142 },
  { name: "Vancouver", province: "BC", routes: 98 },
  { name: "Montreal", province: "QC", routes: 87 },
  { name: "Calgary", province: "AB", routes: 74 },
  { name: "Ottawa", province: "ON", routes: 65 },
  { name: "Hamilton", province: "ON", routes: 53 },
  { name: "London", province: "ON", routes: 48 },
  { name: "Kitchener", province: "ON", routes: 41 },
  { name: "Winnipeg", province: "MB", routes: 39 },
  { name: "Halifax", province: "NS", routes: 32 },
  { name: "Barrie", province: "ON", routes: 27 },
  { name: "Kelowna", province: "BC", routes: 24 },
  { name: "Edmonton", province: "AB", routes: 36 },
  { name: "Saskatoon", province: "SK", routes: 19 },
  { name: "Windsor", province: "ON", routes: 21 },
  { name: "Mississauga", province: "ON", routes: 58 },
];

export default function Cities() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? cities : cities.slice(0, 12);

  return (
    <section id="cities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Service Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Available in 20+ Canadian Cities
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Loop connects riders and drivers across Canada. Find trips near you
            or post your route to any major city.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((city) => (
            <a
              key={city.name}
              href="#"
              className="group flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{city.name}</div>
                <div className="text-gray-500 text-xs">{city.province} · {city.routes} active routes</div>
              </div>
            </a>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              View all cities <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
