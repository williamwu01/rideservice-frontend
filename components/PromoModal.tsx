"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PromoModal.module.css";

const TWO_SPANS = Array.from({ length: 21 });
const SIX_SPANS = Array.from({ length: 26 });

export default function PromoModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("promo_seen")) {
      setOpen(true);
    }
    const handler = () => setOpen(true);
    window.addEventListener("openPromoModal", handler);
    return () => window.removeEventListener("openPromoModal", handler);
  }, []);

  function close() {
    localStorage.setItem("promo_seen", "1");
    setOpen(false);
  }

  function copyCode() {
    navigator.clipboard.writeText("FIFA2026").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="promo-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={close}
        >
          <motion.div
            key="promo-modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-210 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Animated "26" logo — blue top half / red bottom half */}
            <div className={styles.logoWrap}>
              <div className={styles.logo}>
                <div className={`${styles.num} ${styles.numTwo}`}>
                  {TWO_SPANS.map((_, i) => <span key={i} />)}
                </div>
                <div className={`${styles.num} ${styles.numSix}`}>
                  {SIX_SPANS.map((_, i) => <span key={i} />)}
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://www.donotfold.be/data/codepen/wk2026/fifa-world-cup-2026.png"
                alt="FIFA World Cup 2026"
                className={styles.logoImg}
              />
            </div>

            {/* Promo content */}
            <div className="bg-[#050B1A] px-6 py-5 text-center">
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                Welcome Offer
              </div>

              <h2 className="text-white text-xl font-black mb-1">
                $10 off your first ride
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Book any FIFA World Cup 2026 ride and save instantly.
              </p>

              <button
                onClick={copyCode}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:border-[#d4af37]/50 rounded-xl px-4 py-3 transition-all group"
              >
                <span className="text-[#d4af37] font-mono font-bold tracking-widest text-sm">
                  FIFA2026
                </span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                  {copied ? "✓ Copied!" : "Tap to copy"}
                </span>
              </button>

              <p className="text-gray-600 text-xs mt-3">
                Valid for first-time riders only · One use per account.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
