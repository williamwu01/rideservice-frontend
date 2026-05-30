"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Hero() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-[#050B1A] overflow-hidden pt-16">

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
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* FIFA badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          Official Ride Partner · FIFA World Cup 2026™
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4"
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
          className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed"
        >
          Premium private rides across Canada&apos;s FIFA 2026 host cities.
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
            className="inline-flex items-center gap-2 border border-white/20 text-white hover:border-white/50 font-semibold px-8 py-4 rounded-xl text-sm uppercase tracking-wide transition-all hover:bg-white/5"
          >
            How It Works
          </a>
        </motion.div>

        {/* WhatsApp booking */}
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
                <div className="text-sm font-semibold text-green-400">Check your WhatsApp!</div>
                <div className="text-xs text-green-500/80">We sent you a message to get started.</div>
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
                    body: JSON.stringify({ phone }),
                  });
                  if (!res.ok) throw new Error();
                  setStatus("success");
                } catch {
                  setStatus("error");
                }
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">+1</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setStatus("idle"); setPhone(e.target.value); }}
                  placeholder="(604) 000-0000"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#00a0dc]/50 focus:ring-1 focus:ring-[#00a0dc]/30"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb558] text-white font-semibold px-5 py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {status === "loading" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
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
          className="mt-12 flex gap-8 sm:gap-16 text-center"
        >
          {[
            { value: "20+", label: "Canadian Cities" },
            { value: "3", label: "World Cup Hosts" },
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
        <span className="text-xs text-gray-600 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent" />
      </motion.div>
    </section>
  );
}
