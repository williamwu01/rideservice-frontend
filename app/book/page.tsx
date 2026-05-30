"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Estimate = {
  distanceKm: number;
  durationMin: number;
  fare: number;
  breakdown: {
    baseFare: number;
    bookingFee: number;
    distanceCost: number;
    timeCost: number;
    airportFee: number;
    lateNightFee: number;
  };
};

type Step = "route" | "details" | "payment";

export default function BookPage() {
  // Step tracking
  const [step, setStep] = useState<Step>("route");

  // Route step
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState("");

  // Details step
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);

  // Payment step
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  async function handleGetEstimate(e: React.SyntheticEvent) {
    e.preventDefault();
    setEstimateLoading(true);
    setEstimateError("");
    setEstimate(null);
    try {
      const res = await fetch(
        `${API_URL}/api/estimate?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to get estimate");
      setEstimate(data.estimate);
    } catch (err: unknown) {
      setEstimateError(err instanceof Error ? err.message : "Could not calculate estimate. Check your addresses.");
    } finally {
      setEstimateLoading(false);
    }
  }

  async function handleBooking() {
    setBookingLoading(true);
    setBookingError("");
    try {
      const res = await fetch(`${API_URL}/api/book-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+1${phone.replace(/\D/g, "")}`,
          firstName,
          lastName,
          pickup,
          destination,
          pickupTime: pickupTime || "ASAP",
          passengers,
          luggage,
          estimatedFare: estimate?.fare,
          distanceKm: estimate?.distanceKm,
          durationMin: estimate?.durationMin,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create booking");
      setBookingId(data.booking.id);
      setStep("payment");
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleApplyPromo(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!promoCode.trim() || !bookingId) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch(`${API_URL}/api/payment/validate-promo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, promoCode: promoCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Invalid promo code");
      setPromoDiscount(data.discount);
      setPromoApplied(true);
    } catch (err: unknown) {
      setPromoError(err instanceof Error ? err.message : "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  }

  async function handlePay() {
    setPayLoading(true);
    setBookingError("");
    try {
      const origin = window.location.origin;
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          ...(promoApplied && promoCode.trim() && { promoCode: promoCode.trim().toUpperCase() }),
          returnUrl: `${origin}/book/success`,
          cancelUrl: `${origin}/book/cancel`,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Payment setup failed");
      window.location.href = data.approveUrl;
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPayLoading(false);
    }
  }

  const finalFare = estimate ? Math.max(estimate.fare - promoDiscount, 0.5) : 0;

  const steps: { key: Step; label: string; num: number }[] = [
    { key: "route", label: "Route", num: 1 },
    { key: "details", label: "Details", num: 2 },
    { key: "payment", label: "Payment", num: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            Loop
          </Link>
          <span className="text-sm text-gray-500">Book a Ride</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step === s.key
                      ? "bg-indigo-600 text-white"
                      : steps.findIndex((x) => x.key === step) > i
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {steps.findIndex((x) => x.key === step) > i ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${step === s.key ? "text-indigo-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 transition-colors ${
                    steps.findIndex((x) => x.key === step) > i ? "bg-indigo-200" : "bg-gray-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Route ── */}
        {step === "route" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Where are you going?</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your pickup and drop-off to get a price estimate.</p>

            <form onSubmit={handleGetEstimate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup location</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <input
                    value={pickup}
                    onChange={(e) => { setPickup(e.target.value); setEstimate(null); }}
                    placeholder="e.g. Vancouver International Airport"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  </div>
                  <input
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); setEstimate(null); }}
                    placeholder="e.g. BC Place Stadium, Vancouver"
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {estimateError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{estimateError}</p>
              )}

              <button
                type="submit"
                disabled={estimateLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {estimateLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  "Get Estimate"
                )}
              </button>
            </form>

            {/* Estimate result */}
            {estimate && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Estimated Fare</p>
                    <p className="text-3xl font-bold text-gray-900">${estimate.fare.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">CAD · prices may vary</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{estimate.distanceKm} km</p>
                    <p className="text-xs text-gray-500">{Math.round(estimate.durationMin)} min</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Breakdown</p>
                  <FareRow label="Base fare" value={estimate.breakdown.baseFare} />
                  <FareRow label="Distance" value={estimate.breakdown.distanceCost} />
                  <FareRow label="Time" value={estimate.breakdown.timeCost} />
                  <FareRow label="Booking fee" value={estimate.breakdown.bookingFee} />
                  {estimate.breakdown.airportFee > 0 && (
                    <FareRow label="Airport fee" value={estimate.breakdown.airportFee} />
                  )}
                  {estimate.breakdown.lateNightFee > 0 && (
                    <FareRow label="Late night fee" value={estimate.breakdown.lateNightFee} />
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${estimate.fare.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("details")}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
                >
                  Continue with this quote →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === "details" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <button
              onClick={() => setStep("route")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Your details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about yourself and your trip.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                    +1
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(604) 555-0100"
                    required
                    className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">We&apos;ll send your driver info here.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup time</label>
                <input
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="ASAP — or e.g. May 29 at 3pm, tomorrow 10am"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank for ASAP pickup.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPassengers(n)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        passengers === n
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luggage bags</label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setLuggage(n)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        luggage === n
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {bookingError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{bookingError}</p>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading || !firstName || !lastName || !phone}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {bookingLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  "Continue to Payment →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Payment ── */}
        {step === "payment" && estimate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <button
              onClick={() => setStep("details")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Pay</h2>
            <p className="text-sm text-gray-500 mb-6">Confirm your trip details and complete payment.</p>

            {/* Trip summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex gap-3 items-start">
                <div className="flex flex-col items-center pt-1 gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <div className="w-0.5 h-6 bg-gray-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">From</p>
                    <p className="text-sm font-medium text-gray-900">{pickup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">To</p>
                    <p className="text-sm font-medium text-gray-900">{destination}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-xs font-medium text-gray-700">{pickupTime || "ASAP"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Passengers</p>
                  <p className="text-xs font-medium text-gray-700">{passengers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Luggage</p>
                  <p className="text-xs font-medium text-gray-700">{luggage} bag{luggage !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated fare</span>
                <span>${estimate.fare.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo ({promoCode.toUpperCase()})</span>
                  <span>−${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total</span>
                <span className="text-xl">${finalFare.toFixed(2)} CAD</span>
              </div>
            </div>

            {/* Promo code */}
            {!promoApplied && (
              <form onSubmit={handleApplyPromo} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo code</label>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                    placeholder="e.g. FIFA2026"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading || !promoCode.trim()}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs text-red-500 mt-1">{promoError}</p>
                )}
              </form>
            )}

            {bookingError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{bookingError}</p>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={payLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#0070ba] hover:bg-[#005ea6] text-white py-4 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {payLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  <PayPalIcon />
                  Pay ${finalFare.toFixed(2)} CAD with PayPal
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              You&apos;ll be redirected to PayPal to complete payment securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FareRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}

function PayPalIcon() {
  return (
    <svg className="w-16 h-4" viewBox="0 0 101 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.2 2.3H5.6c-.4 0-.8.3-.9.7L2 19.8c-.1.3.2.6.5.6H5.7c.4 0 .8-.3.9-.7l.7-4.6c.1-.4.5-.7.9-.7h2.2c4.5 0 7.1-2.2 7.8-6.5.3-1.9 0-3.4-.9-4.4-.9-1.1-2.6-1.6-5.1-1.6z" fill="#fff"/>
      <path d="M13.1 8.8c-.4 2.5-2.3 2.5-4.1 2.5H8l.7-4.7h.9c1.2 0 2.4 0 3 .7.3.4.5 1 .5 1.5zM25.7 14.6h-3.2c-.3 0-.5.2-.6.5l-.1.9-.2-.3c-.7-1-2.2-1.3-3.7-1.3-3.5 0-6.4 2.6-7 6.3-.3 1.8.1 3.5 1.2 4.7.9 1.1 2.3 1.5 3.9 1.5 2.8 0 4.4-1.8 4.4-1.8l-.1.9c-.1.3.2.6.5.6h2.9c.4 0 .8-.3.9-.7l1.7-11c.1-.4-.2-.6-.6-.3z" fill="#fff"/>
      <path d="M21.7 20.9c-.3 1.8-1.7 3-3.5 3-1 0-1.7-.3-2.2-.9-.5-.6-.7-1.4-.5-2.3.3-1.8 1.7-3 3.4-3 .9 0 1.7.3 2.2.9.5.6.7 1.5.6 2.3z" fill="#fff"/>
    </svg>
  );
}
