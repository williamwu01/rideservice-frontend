"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Hero() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("1");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050B1A] overflow-hidden pt-16">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,160,220,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,160,220,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Radial glow behind globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00a0dc] opacity-[0.07] blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#d4af37] opacity-[0.06] blur-[60px] pointer-events-none" />

      {/* 3D Globe — centered behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none">
        <Globe3D scrollY={scrollY} />
      </div>

      {/* Content */}
      <div className="relative z-10 pb-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* FIFA badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          FIFA World Cup 2026™ · We Got You Covered! 
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-4"
        >
          RIDE THE
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5d878] to-[#d4af37]">
            WORLD CUP
          </span>
          <br />
          WAVE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mb-10 leading-relaxed"
        >
          Premium private rides in Vancouver for FIFA 2026 visitors.
          Book instantly — no surge, no surprises.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-10"
        >
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#c9a227] text-black font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Get Free Estimate
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white hover:border-gray-400 dark:hover:border-white/50 font-semibold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all hover:bg-gray-100 dark:hover:bg-white/5"
          >
            How It Works
          </a>
        </motion.div>

        {/* SMS booking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full max-w-md"
          id="book"
        >
          {status === "success" ? (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-5 py-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-green-400">Check your texts!</div>
                <div className="text-xs text-green-500/80">We sent you an SMS to get started.</div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus("loading");
                try {
                  const res = await fetch(`${API_URL}/api/whatsapp/start`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: `+${countryCode}${phone.replace(/\D/g, "")}` }),
                  });
                  if (!res.ok) throw new Error();
                  setStatus("success");
                } catch {
                  setStatus("error");
                }
              }}
              className="flex gap-2"
            >
              <div className="flex flex-1">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2 py-3.5 bg-gray-100 dark:bg-white/5 border border-r-0 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-l-xl text-sm focus:outline-none focus:border-[#00a0dc]/50"
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
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setStatus("idle"); setPhone(e.target.value); }}
                  placeholder="604 000-0000"
                  required
                  className="flex-1 min-w-0 px-4 py-3.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 rounded-r-xl text-sm focus:outline-none focus:border-[#00a0dc]/50 focus:ring-1 focus:ring-[#00a0dc]/30"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {status === "loading" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Text Me
                  </>
                )}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400 mt-2 text-left">Something went wrong. Please try again.</p>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-12 mb-20 flex gap-8 sm:gap-16 text-center"
        >
          {[
            { value: "YVR", label: "Vancouver, BC" },
            { value: "FIFA", label: "2026 Ready" },
            { value: "4.9★", label: "Driver Rating" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-[#d4af37]">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-400 dark:from-gray-600 to-transparent" />
      </motion.div>
    </section>
  );
}
