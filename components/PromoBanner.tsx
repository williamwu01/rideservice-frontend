"use client";

import { useState, useEffect } from "react";
import { Press_Start_2P } from "next/font/google";
import styles from "./PromoBanner.module.css";

const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400" });

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getDateStr() {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

function getTimeStr() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function PromoBanner() {
  const [time, setTime] = useState(getTimeStr());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeStr()), 1000);
    return () => clearInterval(id);
  }, []);

  function openModal() {
    window.dispatchEvent(new CustomEvent("openPromoModal"));
  }

  const segment = `  ⚡  USE CODE: FIFA2026  ✦  ${getDateStr()}  ✦  ${time}  ✦  CLICK HERE TO CLAIM $10 OFF  `;
  const repeated = Array(6).fill(segment).join("");

  return (
    <div
      className="w-full bg-black h-9 overflow-hidden flex items-center cursor-pointer select-none"
      onClick={openModal}
      role="button"
      aria-label="Open promo code"
    >
      <div className={`${pressStart.className} ${styles.track} inline-flex whitespace-nowrap text-[8px] leading-none text-[#d4af37]`}>
        <span>{repeated}</span>
        <span>{repeated}</span>
      </div>
    </div>
  );
}
