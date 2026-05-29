"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Hero() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Canada&apos;s #1 Rideshare Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Move, Deliver,{" "}
              <span className="text-indigo-600">Connect.</span>
              <br />
              All with Loop.
            </h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Book rides, post trips, and send packages across 20+ Canadian
              cities. Verified drivers, real-time tracking, and lower fees than
              the competition.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              {[
                "Verified drivers & background checks",
                "Real-time GPS & in-app messaging",
                "Eco-conscious Loop Coins rewards",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                Book a Ride
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA — WhatsApp booking */}
            {status === "success" ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4" id="book">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-800">Check your WhatsApp!</div>
                  <div className="text-xs text-green-600">We sent you a message to get your ride started.</div>
                </div>
              </div>
            ) : (
              <form
                id="book"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setStatus("loading");
                  try {
                    const res = await fetch(`${API_URL}/api/whatsapp/start`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ phone }),
                    });
                    if (!res.ok) throw new Error("Failed");
                    setStatus("success");
                  } catch {
                    setStatus("error");
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                    +1
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setStatus("idle");
                      setPhone(e.target.value);
                    }}
                    placeholder="(555) 000-0000"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>
                      Book via WhatsApp
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-xs text-red-500 mt-1 sm:col-span-2">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <span>Available in 20+ Canadian cities</span>
              <ArrowRight className="w-4 h-4" />
              <a href="#cities" className="text-indigo-600 font-medium hover:underline">
                View all cities
              </a>
            </div>
          </div>

          {/* Right – Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-[520px] bg-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-800 overflow-hidden flex flex-col">
                {/* Status bar */}
                <div className="bg-gray-900 flex justify-between items-center px-6 py-2">
                  <span className="text-white text-xs">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded-sm bg-white opacity-80" />
                  </div>
                </div>
                {/* Screen */}
                <div className="flex-1 bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-white text-2xl font-bold">L</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Loop Rideshare</h3>
                  <p className="text-indigo-200 text-xs text-center mb-6">Move. Deliver. Connect.</p>

                  <div className="w-full space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium">Where to?</div>
                        <div className="text-indigo-200 text-xs">Search destination...</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-gray-800 text-xs font-semibold">Toronto → Ottawa</div>
                        <div className="text-gray-500 text-xs">2 seats · Today 3PM</div>
                      </div>
                      <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-lg">$35</div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-white text-xs font-semibold">Vancouver → Kelowna</div>
                        <div className="text-indigo-200 text-xs">3 seats · Tomorrow 8AM</div>
                      </div>
                      <div className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">$42</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-8 top-20 bg-white shadow-lg rounded-2xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">Verified Driver</div>
                  <div className="text-xs text-gray-500">Background checked</div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-24 bg-white shadow-lg rounded-2xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⭐</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">4.9 Rating</div>
                  <div className="text-xs text-gray-500">Top rated driver</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
