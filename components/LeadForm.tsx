"use client";

import { useEffect, useState } from "react";

type Step = "phone" | "details" | "success";

type Status =
  | "school_student"
  | "ug_student"
  | "pg_student"
  | "working_professional"
  | "parent"
  | "other";

const statusOptions: { value: Status; label: string; labelTa: string }[] = [
  { value: "ug_student", label: "Undergrad student", labelTa: "பட்டப்படிப்பு மாணவர்" },
  { value: "pg_student", label: "Postgrad student", labelTa: "முதுகலை மாணவர்" },
  { value: "working_professional", label: "Working professional", labelTa: "பணியில் உள்ளவர்" },
  { value: "school_student", label: "School student (Class 11–12)", labelTa: "பள்ளி மாணவர்" },
  { value: "parent", label: "Parent", labelTa: "பெற்றோர்" },
  { value: "other", label: "Other", labelTa: "மற்றவை" },
];

function getUTMFromLocation() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const pick = (k: string) => params.get(k) ?? undefined;
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
  };
}

function validatePhoneClient(raw: string): string | null {
  const digits = raw.replace(/\D+/g, "");
  let d = digits;
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^[6-9]/.test(d)) return null;
  return d;
}

export function LeadForm() {
  const [step, setStep] = useState<Step>("phone");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneClean, setPhoneClean] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect TANCET interest from URL once
  const [interest, setInterest] = useState<
    "tancet" | "admissions" | "placements" | "careers" | "general"
  >("general");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    const q = new URLSearchParams(window.location.search);
    if (path.includes("tancet") || q.get("interest") === "tancet") {
      setInterest("tancet");
    }
  }, []);

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const clean = validatePhoneClient(phoneRaw);
    if (!clean) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhoneClean(clean);
    setStep("details");
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please tell us your name.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        name: name.trim(),
        phone: phoneClean,
        college: college.trim(),
        current_status: status || undefined,
        interest,
        website, // honeypot — must be empty
        ...getUTMFromLocation(),
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setStep("success");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (step === "success") {
    return (
      <div className="success-msg">
        <h3>
          <span className="en-content">You&rsquo;re in! &#127881;</span>
          <span className="ta-content">நன்றி! &#127881;</span>
        </h3>
        <p>
          <span className="en-content">
            We&rsquo;ll WhatsApp you the moment we launch. TANCET resources drop on day one.
          </span>
          <span className="ta-content">
            விரைவில் WhatsApp-இல் தொடர்பு கொள்வோம். TANCET பொருட்கள் முதல் நாளே.
          </span>
        </p>
      </div>
    );
  }

  if (step === "phone") {
    return (
      <>
        <form className="signup-form-compact" onSubmit={handlePhoneSubmit} noValidate>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={13}
            placeholder="Your mobile number"
            aria-label="Mobile number"
            value={phoneRaw}
            onChange={(e) => setPhoneRaw(e.target.value)}
            required
          />
          <button type="submit">
            <span className="en-content">Get early access</span>
            <span className="ta-content">பதிவு செய்</span>
          </button>
        </form>
        {error && <p className="signup-error">{error}</p>}
        <p className="signup-note">
          <span className="en-content">
            We&rsquo;ll only message you about launch updates. No spam, ever.
          </span>
          <span className="ta-content">ஸ்பேம் இல்லை. வெளியீடு பற்றி மட்டுமே தகவல்.</span>
        </p>
      </>
    );
  }

  // step === "details"
  return (
    <form className="signup-form-expanded" onSubmit={handleDetailsSubmit} noValidate>
      <div className="phone-pill">
        <span>+91 {phoneClean}</span>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setError(null);
          }}
        >
          change
        </button>
      </div>

      <div className="field">
        <label htmlFor="lf-name">
          <span className="en-content">Your name</span>
          <span className="ta-content">உங்கள் பெயர்</span>
        </label>
        <input
          id="lf-name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Priya K."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="lf-status">
          <span className="en-content">I am a&hellip;</span>
          <span className="ta-content">நான்&hellip;</span>
        </label>
        <select
          id="lf-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | "")}
        >
          <option value="">Select one&hellip;</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="lf-college">
          <span className="en-content">College / University (optional)</span>
          <span className="ta-content">கல்லூரி (விருப்பம்)</span>
        </label>
        <input
          id="lf-college"
          type="text"
          autoComplete="organization"
          placeholder="e.g. Anna University, CEG"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          maxLength={120}
        />
      </div>

      {/* Honeypot */}
      <input
        className="honeypot"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
      />

      <div className="submit-row">
        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? (
            <span>Saving&hellip;</span>
          ) : (
            <>
              <span className="en-content">Lock my early access</span>
              <span className="ta-content">என் இடத்தை உறுதி செய்</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </form>
  );
}
