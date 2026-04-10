import Script from "next/script";
import { LeadForm } from "@/components/LeadForm";
import { CountdownCard } from "@/components/CountdownCard";
import { LangToggle } from "@/components/LangToggle";

// Page-level JSON-LD. Only includes schemas for content actually visible on
// this page — adding FAQ/Service markup for features labeled "coming soon"
// would count as spam per Google's rich-results guidelines.
const tancetEventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "TANCET 2026",
  alternateName: "Tamil Nadu Common Entrance Test 2026",
  description:
    "TANCET (Tamil Nadu Common Entrance Test) 2026 — conducted by Anna University for admission to MBA, MCA, M.E., M.Tech., M.Arch., and M.Plan. programmes in Tamil Nadu.",
  startDate: "2026-05-09T10:00:00+05:30",
  endDate: "2026-05-09T13:00:00+05:30",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Anna University exam centres across Tamil Nadu",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "CollegeOrUniversity",
    name: "Anna University",
    url: "https://www.annauniv.edu",
  },
  about: "MBA admissions in Tamil Nadu",
  inLanguage: "en-IN",
};

export default function HomePage() {
  return (
    <div className="container">
      <Script
        id="ld-tancet-event"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tancetEventJsonLd) }}
      />
      {/* NAV */}
      <nav>
        <a href="/" className="logo" aria-label="CampusVazhi">
          <div className="logo-mark" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 17 L6 11 Q6 7 10 7 L14 7"
                stroke="#0B0820"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M12 4.5 L16 7 L13.5 11"
                stroke="#0B0820"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="logo-wordmark">
            campus<span className="accent">vazhi</span>
          </span>
        </a>
        <div className="nav-right">
          <LangToggle />
        </div>
      </nav>

      <main id="main">
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="badge">
          <span className="en-content">launching soon · may 2026</span>
          <span className="ta-content">விரைவில் வருகிறது · மே 2026</span>
        </div>

        <h1 id="hero-heading">
          <span className="en-content">
            Tamil Nadu&rsquo;s new
            <br />
            path to college is
            <br />
            <span className="highlight">loading.</span>
          </span>
          <span className="ta-content">
            தமிழ்நாட்டின் புதிய
            <br />
            கல்லூரி வழி
            <br />
            <span className="highlight">வருகிறது.</span>
          </span>
        </h1>

        <p className="sub">
          <span className="en-content">
            No shady consultants. No confusion. Real guidance for college
            admissions, TANCET, placements &amp; careers — built for students,
            by people who&rsquo;ve been there.
          </span>
          <span className="ta-content">
            போலி ஆலோசகர்கள் இல்லை. குழப்பம் இல்லை. கல்லூரி சேர்க்கை, TANCET,
            வேலைவாய்ப்பு — அனைத்திற்கும் நம்பகமான வழிகாட்டி.
          </span>
        </p>

        <div className="signup">
          <LeadForm />
        </div>

        <CountdownCard />
      </section>

      {/* FEATURES */}
      <section className="features" aria-labelledby="features-heading">
        <div className="section-title">
          <span className="eyebrow">
            <span className="en-content">what&rsquo;s coming</span>
            <span className="ta-content">வருவது என்ன</span>
          </span>
          <h2 id="features-heading">
            <span className="en-content">
              Everything you need. None of the BS.
            </span>
            <span className="ta-content">
              தேவையானது அனைத்தும். தேவையில்லாதது எதுவும் இல்லை.
            </span>
          </h2>
        </div>

        <div className="features-grid">
          <Feature
            icon="🎓"
            titleEn="MBA Admissions"
            titleTa="MBA சேர்க்கை"
            descEn="Cut through the noise. Find the right college for your score, goals, and budget."
            descTa="சரியான கல்லூரியை கண்டுபிடி. சத்தம் இல்லாமல்."
            status="Coming at launch"
          />
          <Feature
            icon="📝"
            titleEn="TANCET Prep"
            titleTa="TANCET தயாரிப்பு"
            descEn="PYQs, mocks, cheat sheets. All free. All in Tamil + English."
            descTa="முந்தைய தேர்வுகள், மாதிரி தேர்வுகள் — இலவசம்."
            status="Coming at launch"
          />
          <Feature
            icon="✈️"
            titleEn="Study Abroad"
            titleTa="வெளிநாடு படிப்பு"
            descEn="University shortlisting, SOPs, visa guidance — without the lakh-rupee consultant fees."
            descTa="பல்கலைக்கழகம், SOP, விசா — மலிவாக."
            status="Coming soon"
          />
          <Feature
            icon="💼"
            titleEn="Placement Ready"
            titleTa="வேலைவாய்ப்பு"
            descEn="Aptitude, interviews, group discussions. Crack campus placements the right way."
            descTa="ஆப்டிட்யூட், நேர்காணல், குழு விவாதம்."
            status="Coming soon"
          />
          <Feature
            icon="📄"
            titleEn="Resume Builder"
            titleTa="ரெஸ்யூம் உருவாக்கி"
            descEn="Build a resume that actually gets callbacks. Not from 2010. Free forever."
            descTa="உண்மையில் வேலைக்கு அழைக்கும் ரெஸ்யூம். இலவசம்."
            status="Coming soon"
          />
          <Feature
            icon="📣"
            titleEn="Daily Job Alerts"
            titleTa="தினசரி வேலை அறிவிப்பு"
            descEn="Fresh openings, hackathons, internships — straight to your WhatsApp."
            descTa="புதிய வேலை, பயிற்சி — WhatsApp-இல்."
            status="Coming soon"
          />
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="foot-logo">
          campus<span className="accent">vazhi</span>
        </div>
        <p>
          <span className="en-content">
            Built with care for students of Tamil Nadu.
          </span>
          <span className="ta-content">
            தமிழ்நாட்டு மாணவர்களுக்காக அன்புடன் உருவாக்கப்பட்டது.
          </span>
        </p>
        <p className="copy">
          © 2026 CampusVazhi ·{" "}
          <a href="mailto:hello@campusvazhi.com">hello@campusvazhi.com</a>
        </p>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  titleEn,
  titleTa,
  descEn,
  descTa,
  status,
}: {
  icon: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  status: string;
}) {
  return (
    <div className="feature-card">
      <div className="icon">{icon}</div>
      <h4>
        <span className="en-content">{titleEn}</span>
        <span className="ta-content">{titleTa}</span>
      </h4>
      <p>
        <span className="en-content">{descEn}</span>
        <span className="ta-content">{descTa}</span>
      </p>
      <span className="status">● {status}</span>
    </div>
  );
}
