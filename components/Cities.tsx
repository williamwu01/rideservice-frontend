"use client";

import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const cities = [
  { name: "Vancouver", province: "BC", routes: 98, comingSoon: false },
  { name: "Burnaby", province: "BC", routes: 64, comingSoon: false },
  { name: "Richmond", province: "BC", routes: 52, comingSoon: false },
  { name: "Surrey", province: "BC", routes: 47, comingSoon: false },
  { name: "North Vancouver", province: "BC", routes: 38, comingSoon: false },
  { name: "Coquitlam", province: "BC", routes: 31, comingSoon: false },
  { name: "New Westminster", province: "BC", routes: 24, comingSoon: false },
  { name: "Langley", province: "BC", routes: 21, comingSoon: false },
  { name: "Abbotsford", province: "BC", routes: 18, comingSoon: false },
  { name: "Calgary", province: "AB", routes: 0, comingSoon: true },
  { name: "Edmonton", province: "AB", routes: 0, comingSoon: true },
  { name: "Toronto", province: "ON", routes: 0, comingSoon: true },
  { name: "Ottawa", province: "ON", routes: 0, comingSoon: true },
  { name: "Montreal", province: "QC", routes: 0, comingSoon: true },
  { name: "Winnipeg", province: "MB", routes: 0, comingSoon: true },
  { name: "Halifax", province: "NS", routes: 0, comingSoon: true },
];

export default function Cities() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? cities : cities.slice(0, 12);

  return (
    <section id="cities" className="py-20 bg-white dark:bg-[#070E1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            Service Areas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Based in Metro Vancouver, BC
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg">
            RideLink currently serves Metro Vancouver. We are expanding to other Canadian provinces soon — more cities coming.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((city) => (
            <a
              key={city.name}
              href="#"
              className="group flex items-center gap-3 p-4 border border-gray-100 dark:border-white/10 rounded-xl hover:border-indigo-300 dark:hover:border-white/20 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-50 dark:bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-white/10 transition-colors flex-shrink-0">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{city.name}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">{city.province} · {city.comingSoon ? "Coming Soon" : `${city.routes} active pickups`}</div>
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
