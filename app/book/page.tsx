"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import AddressInput from "@/components/AddressInput";

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

type Driver = {
  firstName: string;
  lastName: string;
  carModel: string;
  carNameplate: string;
  photo: string | null;
};

type Step = "route" | "details" | "confirm";

export default function BookPage() {
  const [step, setStep] = useState<Step>("route");

  // Step 1 — route
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState("");

  // Step 2 — details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("1");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeStr, setPickupTimeStr] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [findingDriver, setFindingDriver] = useState(false);
  const [findError, setFindError] = useState("");

  // Step 3 — confirm & pay
  const [bookingId, setBookingId] = useState("");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [reservationSecondsLeft, setReservationSecondsLeft] = useState(300);
  const reservationTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const paymentRedirecting = useRef(false);

  const releaseReservation = useCallback(async (id: string) => {
    try {
      navigator.sendBeacon(`${API_URL}/api/bookings/${id}/release`);
    } catch {}
  }, []);

  useEffect(() => {
    if (step !== "confirm" || !bookingId) return;

    setReservationSecondsLeft(300);
    reservationTimer.current = setInterval(() => {
      setReservationSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(reservationTimer.current!);
          releaseReservation(bookingId);
          setBookingId("");
          setDriver(null);
          setStep("details");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    const onUnload = () => {
      if (!paymentRedirecting.current) releaseReservation(bookingId);
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(reservationTimer.current!);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [step, bookingId, releaseReservation]);

  function handleBackFromConfirm() {
    if (bookingId) releaseReservation(bookingId);
    clearInterval(reservationTimer.current!);
    setBookingId("");
    setDriver(null);
    setStep("details");
  }

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

  async function handleFindDriver() {
    if (!firstName || !lastName || !phone) return;
    setFindingDriver(true);
    setFindError("");

    const scheduledPickupAt =
      pickupDate && pickupTimeStr
        ? new Date(`${pickupDate}T${pickupTimeStr}:00`).toISOString()
        : null;

    try {
      const res = await fetch(`${API_URL}/api/book-ride-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+${countryCode}${phone.replace(/\D/g, "")}`,
          firstName,
          lastName,
          pickup,
          destination,
          passengers,
          luggage,
          scheduledPickupAt,
          pickupTime: scheduledPickupAt ? undefined : "ASAP",
          estimatedFare: estimate?.fare,
          distanceKm: estimate?.distanceKm,
          durationMin: estimate?.durationMin,
          specialRequests: specialRequests || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No drivers available");
      setBookingId(data.bookingId);
      setDriver(data.driver);
      setStep("confirm");
    } catch (err: unknown) {
      setFindError(err instanceof Error ? err.message : "Could not find a driver. Please try again.");
    } finally {
      setFindingDriver(false);
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
    setPayError("");
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
      paymentRedirecting.current = true;
      window.location.href = data.approveUrl;
    } catch (err: unknown) {
      setPayError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPayLoading(false);
    }
  }

  const finalFare = estimate ? Math.max(estimate.fare - promoDiscount, 0.5) : 0;

  const steps: { key: Step; label: string; num: number }[] = [
    { key: "route", label: "Route", num: 1 },
    { key: "details", label: "Details", num: 2 },
    { key: "confirm", label: "Confirm", num: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="RideLink YVR" className="h-8 w-auto rounded-md" />
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
                <AddressInput
                  value={pickup}
                  onChange={(v) => { setPickup(v); setEstimate(null); }}
                  placeholder="e.g. YVR, Vancouver Airport"
                  dotColor="indigo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <AddressInput
                  value={destination}
                  onChange={(v) => { setDestination(v); setEstimate(null); }}
                  placeholder="e.g. BC Place, Downtown Vancouver"
                  dotColor="purple"
                  required
                />
              </div>

              {estimateError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{estimateError}</p>
              )}

              <button
                type="submit"
                disabled={estimateLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {estimateLoading ? <Spinner /> : "Get Estimate"}
              </button>
            </form>

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

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                  <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Breakdown</p>
                  <FareRow label="Base fare" value={estimate.breakdown.baseFare} />
                  <FareRow label="Distance" value={estimate.breakdown.distanceCost} />
                  <FareRow label="Time" value={estimate.breakdown.timeCost} />
                  <FareRow label="Booking fee" value={estimate.breakdown.bookingFee} />
                  {estimate.breakdown.airportFee > 0 && <FareRow label="Airport fee" value={estimate.breakdown.airportFee} />}
                  {estimate.breakdown.lateNightFee > 0 && <FareRow label="Late night fee" value={estimate.breakdown.lateNightFee} />}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${estimate.fare.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("details")}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
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
            <button onClick={() => setStep("route")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
              <ChevronLeft /> Back
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Your details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us who you are and when you need the ride.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" required className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1">🇨🇦 +1</option>
                    <option value="1">🇺🇸 +1</option>
                    <option value="44">🇬🇧 +44</option>
                    <option value="61">🇦🇺 +61</option>
                    <option value="64">🇳🇿 +64</option>
                    <option value="91">🇮🇳 +91</option>
                    <option value="86">🇨🇳 +86</option>
                    <option value="852">🇭🇰 +852</option>
                    <option value="65">🇸🇬 +65</option>
                    <option value="60">🇲🇾 +60</option>
                    <option value="63">🇵🇭 +63</option>
                    <option value="81">🇯🇵 +81</option>
                    <option value="82">🇰🇷 +82</option>
                    <option value="886">🇹🇼 +886</option>
                    <option value="49">🇩🇪 +49</option>
                    <option value="33">🇫🇷 +33</option>
                    <option value="52">🇲🇽 +52</option>
                    <option value="55">🇧🇷 +55</option>
                    <option value="971">🇦🇪 +971</option>
                  </select>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="604 555-0100" required className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <p className="text-xs text-gray-400 mt-1">We&apos;ll send your driver confirmation by text.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup date</label>
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup time</label>
                  <input type="time" value={pickupTimeStr} onChange={(e) => setPickupTimeStr(e.target.value)} className={inputCls} />
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-2">Leave blank for ASAP pickup.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button key={n} type="button" onClick={() => setPassengers(n)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${passengers === n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luggage bags</label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setLuggage(n)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${luggage === n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special requests <span className="text-gray-400">(optional)</span></label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} placeholder="e.g. child seat, accessibility needs" className={inputCls + " resize-none"} />
              </div>

              {findError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{findError}</p>
              )}

              <button
                onClick={handleFindDriver}
                disabled={findingDriver || !firstName || !lastName || !phone}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {findingDriver ? <><Spinner /> Finding your driver...</> : "Find My Driver →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm & Pay ── */}
        {step === "confirm" && driver && estimate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <button onClick={handleBackFromConfirm} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ChevronLeft /> Back
              </button>
              <span className={`text-xs font-mono px-2 py-1 rounded-full ${reservationSecondsLeft <= 60 ? "bg-red-100 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                Reserved for {Math.floor(reservationSecondsLeft / 60)}:{String(reservationSecondsLeft % 60).padStart(2, "0")}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Your driver is ready</h2>
            <p className="text-sm text-gray-500 mb-6">Complete payment within the reservation window to confirm.</p>

            {/* Driver card */}
            <div className="flex items-center gap-4 bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                {driver.photo
                  ? <img src={driver.photo} alt="Driver" className="w-full h-full rounded-full object-cover" />
                  : `${driver.firstName[0]}${driver.lastName[0]}`
                }
              </div>
              <div>
                <p className="font-semibold text-gray-900">{driver.firstName} {driver.lastName}</p>
                <p className="text-sm text-gray-600">{driver.carModel}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-mono">{driver.carNameplate}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2 py-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Available
                </span>
              </div>
            </div>

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
                  <p className="text-xs font-medium text-gray-700">
                    {pickupDate && pickupTimeStr ? `${pickupDate} ${pickupTimeStr}` : "ASAP"}
                  </p>
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
                  <button type="submit" disabled={promoLoading || !promoCode.trim()}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors">
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
              </form>
            )}

            {payError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{payError}</p>
            )}

            <button
              onClick={handlePay}
              disabled={payLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#0070ba] hover:bg-[#005ea6] text-white py-4 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {payLoading ? <Spinner /> : <><PayPalIcon /> Pay ${finalFare.toFixed(2)} CAD with PayPal</>}
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

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500";

function FareRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
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