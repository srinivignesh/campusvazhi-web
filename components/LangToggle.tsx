"use client";

import { useState } from "react";

export function LangToggle() {
  const [lang, setLang] = useState<"en" | "ta">("en");

  function switchTo(next: "en" | "ta") {
    setLang(next);
    if (typeof document === "undefined") return;
    if (next === "ta") {
      document.body.classList.add("lang-ta");
      document.documentElement.lang = "ta";
    } else {
      document.body.classList.remove("lang-ta");
      document.documentElement.lang = "en";
    }
  }

  return (
    <div className="lang-toggle" role="group" aria-label="Language toggle">
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => switchTo("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "ta" ? "active" : ""}
        onClick={() => switchTo("ta")}
      >
        த
      </button>
    </div>
  );
}
