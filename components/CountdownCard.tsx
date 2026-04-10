"use client";

import { useEffect, useState } from "react";

// TANCET 2026: May 9, 2026 at 10:00 IST
const TARGET = new Date("2026-05-09T10:00:00+05:30").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownCard() {
  const [now, setNow] = useState<number>(() => TARGET); // SSR-safe default → 00:00:00:00

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1_000);

  return (
    <div className="tancet-card">
      <span className="label">⚡ Time-sensitive</span>
      <h3>
        <span className="en-content">TANCET 2026 is coming. Fast.</span>
        <span className="ta-content">TANCET 2026 வேகமாக நெருங்குகிறது.</span>
      </h3>
      <p>
        <span className="en-content">
          Free PYQs, mock tests &amp; counselling — drops on launch day.
        </span>
        <span className="ta-content">
          இலவச மாதிரித் தேர்வுகள் மற்றும் வழிகாட்டி — வெளியீட்டு நாளில்.
        </span>
      </p>
      <div className="countdown">
        <div className="cd-unit">
          <div className="num">{pad(days)}</div>
          <div className="lbl">Days</div>
        </div>
        <div className="cd-unit">
          <div className="num">{pad(hours)}</div>
          <div className="lbl">Hours</div>
        </div>
        <div className="cd-unit">
          <div className="num">{pad(mins)}</div>
          <div className="lbl">Mins</div>
        </div>
        <div className="cd-unit">
          <div className="num">{pad(secs)}</div>
          <div className="lbl">Secs</div>
        </div>
      </div>
    </div>
  );
}
