import Script from "next/script";
import { LeadForm } from "@/components/LeadForm";
import { CountdownCard } from "@/components/CountdownCard";
import { LangToggle } from "@/components/LangToggle";

// ---------------------------------------------------------------------------
// JSON-LD: Event (TANCET 2026) + FAQ
// Kept only for content that actually renders on the page — per Google's
// rich-results guidelines. Since Phase B surfaces a full FAQ section and a
// visible TANCET hero banner, both are eligible.
// ---------------------------------------------------------------------------
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

const faqItems: { q: string; a: string; qTa: string; aTa: string }[] = [
  {
    q: "Is CampusVazhi free for students?",
    a: "Yes. Every core tool — TANCET prep, college shortlisting, resume builder, job alerts — is free for students. We earn referral fees from partner colleges and training companies, not from you.",
    qTa: "CampusVazhi மாணவர்களுக்கு இலவசமா?",
    aTa: "ஆம். TANCET தயாரிப்பு, கல்லூரி தேர்வு, ரெஸ்யூம், வேலை அறிவிப்பு — அனைத்தும் மாணவர்களுக்கு முற்றிலும் இலவசம். நாங்கள் கட்டணத்தை பங்குதாரர் கல்லூரிகளிடமிருந்து மட்டுமே பெறுகிறோம்.",
  },
  {
    q: "Do you actually help in Tamil, or is it just translated?",
    a: "Every explanation, video, and WhatsApp message is built in Tamil first, then translated to English. Our team speaks Tamil natively — nothing gets lost.",
    qTa: "தமிழ் வழிகாட்டி உண்மையாகவே கிடைக்குமா?",
    aTa: "ஆம். ஒவ்வொரு விளக்கம், வீடியோ, WhatsApp செய்தியும் முதலில் தமிழில் எழுதப்படுகிறது. எங்கள் குழு தமிழ் நன்கு அறிந்தவர்கள்.",
  },
  {
    q: "Are you authorised counsellors for TANCET and Anna University?",
    a: "We are an independent guidance platform — we are not affiliated with Anna University or any government body. We help students decode the official process and pick the right college for their profile.",
    qTa: "நீங்கள் Anna University-ன் அதிகாரப்பூர்வ ஆலோசகர்களா?",
    aTa: "இல்லை. நாங்கள் சுயாதீன வழிகாட்டி தளம். Anna University அல்லது அரசுடன் இணைப்பு இல்லை. அதிகாரப்பூர்வ நடைமுறையை புரிந்து கொள்ள உதவுகிறோம்.",
  },
  {
    q: "How is CampusVazhi different from the agents my uncle recommended?",
    a: "Most local agents get paid only if you join one specific college — so they push that college, not the best one for you. We partner with 50+ colleges and get paid the same from each, so our recommendation is unbiased by design.",
    qTa: "உள்ளூர் ஏஜென்ட்டைவிட நீங்கள் எவ்வாறு வேறுபடுகிறீர்கள்?",
    aTa: "பெரும்பாலான ஏஜென்ட்கள் ஒரே ஒரு கல்லூரியை மட்டும் பரிந்துரைப்பார்கள் — அங்கே மட்டுமே கமிஷன். நாங்கள் 50+ கல்லூரிகளுடன் இணைந்துள்ளோம், பக்கச்சார்பு இல்லை.",
  },
  {
    q: "What scores do I need for top Tamil Nadu MBA colleges?",
    a: "Anna University MBA usually needs TANCET 99+ percentile. Private tier-1 colleges in TN (Loyola, SSN, PSG) are competitive at 90+. We have cutoff data for 50+ colleges on our college directory (launching with Phase B).",
    qTa: "தமிழ்நாடு MBA கல்லூரிகளுக்கு என்ன மதிப்பெண் தேவை?",
    aTa: "Anna University MBA-க்கு 99+ percentile தேவை. தனியார் tier-1 கல்லூரிகள் (Loyola, SSN, PSG) 90+ percentile-ல் கிடைக்கும். 50+ கல்லூரிகளின் cutoff தரவு எங்கள் directory-ல் உள்ளது.",
  },
  {
    q: "My child just finished 12th — is CampusVazhi for them?",
    a: "Yes. We cover the full journey: UG admissions after 12th, placement training during college, PG admissions, study abroad, and first-job support. Join the waitlist and we'll share the right resources for your child's stage.",
    qTa: "என் மகன்/மகள் 12-ம் வகுப்பை முடித்துள்ளார். CampusVazhi பயனுள்ளதாக இருக்குமா?",
    aTa: "ஆம். UG சேர்க்கை முதல் வேலைவாய்ப்பு, வெளிநாடு படிப்பு வரை எல்லாம் உள்ளது. Waitlist-ல் சேருங்கள், உங்கள் குழந்தைக்கு ஏற்ற ஆதாரங்களை நாங்கள் அனுப்புவோம்.",
  },
  {
    q: "Will you send me spam on WhatsApp?",
    a: "No. We send one weekly digest (free TANCET resources, new college alerts, job openings) and important exam reminders. You can stop anytime by replying STOP.",
    qTa: "WhatsApp-ல் spam அனுப்புவீர்களா?",
    aTa: "இல்லை. வாரத்திற்கு ஒருமுறை மட்டுமே — இலவச TANCET ஆதாரங்கள், புதிய கல்லூரி செய்திகள், வேலை அறிவிப்பு. STOP என்று பதில் அனுப்பினால் நிறுத்திவிடுவோம்.",
  },
  {
    q: "When does the full platform launch?",
    a: "Core tools (TANCET prep, college shortlisting, waitlist-only counselling) are live through April-May 2026. The full six-vertical platform launches in June 2026 right after TANCET results.",
    qTa: "முழு தளம் எப்போது தொடங்கும்?",
    aTa: "முதன்மை கருவிகள் (TANCET, கல்லூரி தேர்வு, ஆலோசனை) ஏப்ரல்-மே 2026-ல் செயல்பாட்டில் உள்ளன. முழு platform ஜூன் 2026-ல் — TANCET முடிவுகளுக்குப் பிறகு.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
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
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                stroke="#1A0B2E"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M12 4.5 L16 7 L13.5 11"
                stroke="#1A0B2E"
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
          <div className="decor d1" aria-hidden="true">✨</div>
          <div className="decor d2" aria-hidden="true">🎓</div>
          <div className="decor d3" aria-hidden="true">📚</div>
          <div className="decor d4" aria-hidden="true">🚀</div>

          <div className="sticker pink">
            <span className="en-content">● launching may 2026 · free forever</span>
            <span className="ta-content">● மே 2026-ல் தொடக்கம் · எப்போதும் இலவசம்</span>
          </div>

          <h1 id="hero-heading">
            <span className="en-content">
              Your <span className="hl pink">college.</span>
              <br />
              Your <span className="hl mint">career.</span>
              <br />
              Your <span className="hl indigo">rules.</span>
            </span>
            <span className="ta-content">
              உங்கள் <span className="hl pink">கல்லூரி.</span>
              <br />
              உங்கள் <span className="hl mint">வேலை.</span>
              <br />
              உங்கள் <span className="hl indigo">வழி.</span>
            </span>
          </h1>

          <p className="sub">
            <span className="en-content">
              No shady consultants. No lakh-rupee fees. Just real guidance — in
              Tamil and English — for TANCET, MBA admissions, placements,
              resumes, study abroad, and first jobs. Built by IIM grads who
              grew up in TN.
            </span>
            <span className="ta-content">
              போலி ஆலோசகர்கள் இல்லை. லட்சக்கணக்கில் கட்டணம் இல்லை. TANCET, MBA
              சேர்க்கை, வேலைவாய்ப்பு, ரெஸ்யூம், வெளிநாடு படிப்பு — அனைத்திற்கும்
              நம்பகமான வழிகாட்டி. தமிழ்நாட்டில் வளர்ந்த IIM பட்டதாரிகளால்
              உருவாக்கப்பட்டது.
            </span>
          </p>

          <div className="signup">
            <LeadForm />
          </div>

          <CountdownCard />
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip" aria-label="Why students trust CampusVazhi">
          <div className="trust-chip pink">
            <span className="emoji">🏫</span>
            <span className="en-content">50+ partner colleges</span>
            <span className="ta-content">50+ பங்குதாரர் கல்லூரிகள்</span>
          </div>
          <div className="trust-chip amber">
            <span className="emoji">₹</span>
            <span className="en-content">₹0 from students</span>
            <span className="ta-content">மாணவர்களிடமிருந்து ₹0</span>
          </div>
          <div className="trust-chip mint">
            <span className="emoji">🗣️</span>
            <span className="en-content">Tamil + English, always</span>
            <span className="ta-content">தமிழ் + ஆங்கிலம், எப்போதும்</span>
          </div>
          <div className="trust-chip indigo">
            <span className="emoji">🎓</span>
            <span className="en-content">Built by IIM grads</span>
            <span className="ta-content">IIM பட்டதாரிகளால் உருவாக்கப்பட்டது</span>
          </div>
        </section>

        {/* TANCET HUB — seasonal banner */}
        <section className="section" aria-labelledby="tancet-heading">
          <div className="tancet-hub">
            <div className="inner">
              <span className="tag">
                <span className="en-content">● TANCET 2026 · May 9</span>
                <span className="ta-content">● TANCET 2026 · மே 9</span>
              </span>
              <h3 id="tancet-heading">
                <span className="en-content">
                  The only TANCET prep stack you&rsquo;ll need. Free.
                </span>
                <span className="ta-content">
                  TANCET தயாரிப்புக்கு தேவையானது அனைத்தும். இலவசம்.
                </span>
              </h3>
              <p className="body">
                <span className="en-content">
                  Stuck finding clean PYQs? Confused about the 5-section split?
                  We&rsquo;ve packaged everything into a single, Tamil-friendly
                  prep hub.
                </span>
                <span className="ta-content">
                  முந்தைய வினாத்தாள்கள் கிடைக்கவில்லையா? 5 பிரிவுகளில் எந்தது
                  முக்கியம்? அனைத்தையும் ஒரே இடத்தில் — தமிழிலும்.
                </span>
              </p>

              <div className="pillars">
                <div className="pillar">
                  <div className="num">01</div>
                  <h5>
                    <span className="en-content">10 years of PYQs</span>
                    <span className="ta-content">10 ஆண்டு PYQs</span>
                  </h5>
                  <p>
                    <span className="en-content">
                      Clean, solved, section-wise. With Tamil explanations.
                    </span>
                    <span className="ta-content">
                      தீர்வுகளுடன், பிரிவு வாரியாக, தமிழில் விளக்கங்கள்.
                    </span>
                  </p>
                </div>
                <div className="pillar">
                  <div className="num">02</div>
                  <h5>
                    <span className="en-content">5 full-length mocks</span>
                    <span className="ta-content">5 முழு மாதிரி தேர்வுகள்</span>
                  </h5>
                  <p>
                    <span className="en-content">
                      Real TANCET difficulty. With percentile predictor.
                    </span>
                    <span className="ta-content">
                      உண்மையான TANCET அளவு. Percentile கணிப்புடன்.
                    </span>
                  </p>
                </div>
                <div className="pillar">
                  <div className="num">03</div>
                  <h5>
                    <span className="en-content">Section cheat sheets</span>
                    <span className="ta-content">பிரிவு cheat sheets</span>
                  </h5>
                  <p>
                    <span className="en-content">
                      Quant, DI, LR, English, GK — what to study in 30 days.
                    </span>
                    <span className="ta-content">
                      Quant, DI, LR, ஆங்கிலம், GK — 30 நாளில் என்ன படிக்க வேண்டும்.
                    </span>
                  </p>
                </div>
                <div className="pillar">
                  <div className="num">04</div>
                  <h5>
                    <span className="en-content">Post-exam counselling</span>
                    <span className="ta-content">தேர்வுக்குப் பிறகு ஆலோசனை</span>
                  </h5>
                  <p>
                    <span className="en-content">
                      Which college matches your score? We&rsquo;ll tell you.
                    </span>
                    <span className="ta-content">
                      உங்கள் மதிப்பெண்ணுக்கு எந்த கல்லூரி? நாங்கள் சொல்வோம்.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERTICALS — the 6 things we do */}
        <section className="section" aria-labelledby="verticals-heading">
          <div className="section-head">
            <span className="eyebrow">
              <span className="en-content">what we do</span>
              <span className="ta-content">நாங்கள் செய்வது</span>
            </span>
            <h2 id="verticals-heading">
              <span className="en-content">Everything you need. None of the BS.</span>
              <span className="ta-content">
                தேவையானது அனைத்தும். தேவையில்லாதது எதுவும் இல்லை.
              </span>
            </h2>
            <p className="lede">
              <span className="en-content">
                Six tools built for Tamil Nadu students — from your first
                college application to your first salary credit.
              </span>
              <span className="ta-content">
                தமிழ்நாட்டு மாணவர்களுக்காக ஆறு கருவிகள் — முதல் கல்லூரி
                விண்ணப்பம் முதல் முதல் சம்பளம் வரை.
              </span>
            </p>
          </div>

          <div className="verticals">
            {/* 1. MBA Admissions */}
            <article className="vertical-card c-pink">
              <div className="emoji-block">🎓</div>
              <div className="who">
                <span className="en-content">For 12th pass · UG · PG aspirants</span>
                <span className="ta-content">12வது முடித்தவர் · UG · PG</span>
              </div>
              <h3>
                <span className="en-content">MBA Admissions Counselling</span>
                <span className="ta-content">MBA சேர்க்கை ஆலோசனை</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  Cut through the noise. 50+ partner colleges mapped by cutoff,
                  fees, placements, and real alumni feedback.
                </span>
                <span className="ta-content">
                  50+ கல்லூரிகள் — cutoff, கட்டணம், placement, முன்னாள்
                  மாணவர்களின் கருத்துகளுடன்.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">Profile-matched shortlisting</span>
                  <span className="ta-content">உங்கள் திறமைக்கு ஏற்ற கல்லூரி</span>
                </li>
                <li>
                  <span className="en-content">Management quota transparency</span>
                  <span className="ta-content">Management quota வெளிப்படை</span>
                </li>
                <li>
                  <span className="en-content">Interview &amp; essay prep</span>
                  <span className="ta-content">நேர்காணல் &amp; essay தயாரிப்பு</span>
                </li>
              </ul>
              <span className="status-chip live">
                <span className="en-content">● Live May 2026</span>
                <span className="ta-content">● மே 2026</span>
              </span>
            </article>

            {/* 2. TANCET Prep */}
            <article className="vertical-card c-amber">
              <div className="emoji-block">📝</div>
              <div className="who">
                <span className="en-content">For TANCET 2026 aspirants</span>
                <span className="ta-content">TANCET 2026 மாணவர்களுக்கு</span>
              </div>
              <h3>
                <span className="en-content">TANCET Prep Hub</span>
                <span className="ta-content">TANCET தயாரிப்பு மையம்</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  10 years of PYQs, 5 mocks, section cheat sheets — all free,
                  all in Tamil + English.
                </span>
                <span className="ta-content">
                  10 ஆண்டு PYQs, 5 மாதிரி தேர்வுகள், cheat sheets — முற்றிலும்
                  இலவசம்.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">Section-wise difficulty data</span>
                  <span className="ta-content">பிரிவு வாரியான கடினத்தன்மை</span>
                </li>
                <li>
                  <span className="en-content">Percentile predictor tool</span>
                  <span className="ta-content">Percentile கணிப்பு கருவி</span>
                </li>
                <li>
                  <span className="en-content">WhatsApp doubt-solving group</span>
                  <span className="ta-content">WhatsApp doubt குழு</span>
                </li>
              </ul>
              <span className="status-chip live">
                <span className="en-content">● Live Apr 2026</span>
                <span className="ta-content">● ஏப்ரல் 2026</span>
              </span>
            </article>

            {/* 3. Study Abroad */}
            <article className="vertical-card c-sky">
              <div className="emoji-block">✈️</div>
              <div className="who">
                <span className="en-content">For UG/PG students eyeing abroad</span>
                <span className="ta-content">வெளிநாடு படிக்க விரும்புபவர்</span>
              </div>
              <h3>
                <span className="en-content">Study Abroad Guidance</span>
                <span className="ta-content">வெளிநாடு படிப்பு வழிகாட்டி</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  University shortlisting, SOPs, visa prep — without the
                  ₹1.5 lakh consultant fees. University pays us, not you.
                </span>
                <span className="ta-content">
                  பல்கலைக்கழகம், SOP, விசா — ₹1.5 லட்ச கட்டணம் இல்லை.
                  பல்கலைக்கழகம் எங்களுக்கு கட்டணம் கொடுக்கும், உங்களுக்கு இல்லை.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">US, UK, Canada, Germany, Australia</span>
                  <span className="ta-content">US, UK, Canada, Germany, ஆஸ்திரேலியா</span>
                </li>
                <li>
                  <span className="en-content">SOP editing by IIM grads</span>
                  <span className="ta-content">IIM பட்டதாரிகளால் SOP திருத்தம்</span>
                </li>
                <li>
                  <span className="en-content">Scholarship database</span>
                  <span className="ta-content">Scholarship தரவுத்தளம்</span>
                </li>
              </ul>
              <span className="status-chip soon">
                <span className="en-content">● Coming Jun 2026</span>
                <span className="ta-content">● ஜூன் 2026</span>
              </span>
            </article>

            {/* 4. Placement Ready */}
            <article className="vertical-card c-mint">
              <div className="emoji-block">💼</div>
              <div className="who">
                <span className="en-content">For 2nd/3rd/final-year students</span>
                <span className="ta-content">2/3/இறுதி ஆண்டு மாணவர்</span>
              </div>
              <h3>
                <span className="en-content">Placement Ready</span>
                <span className="ta-content">வேலைவாய்ப்பு தயாரிப்பு</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  Aptitude, GDs, HR rounds, mock interviews. The elite campus
                  placement toolkit — now accessible in Tamil.
                </span>
                <span className="ta-content">
                  Aptitude, குழு விவாதம், HR சுற்று, மாதிரி நேர்காணல்கள் —
                  தமிழிலும்.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">500+ aptitude problems</span>
                  <span className="ta-content">500+ aptitude கேள்விகள்</span>
                </li>
                <li>
                  <span className="en-content">Live GD practice sessions</span>
                  <span className="ta-content">நேரடி GD பயிற்சி</span>
                </li>
                <li>
                  <span className="en-content">HR &amp; tech interview banks</span>
                  <span className="ta-content">HR &amp; tech கேள்வி வங்கி</span>
                </li>
              </ul>
              <span className="status-chip soon">
                <span className="en-content">● Coming Jul 2026</span>
                <span className="ta-content">● ஜூலை 2026</span>
              </span>
            </article>

            {/* 5. Resume Builder */}
            <article className="vertical-card c-indigo">
              <div className="emoji-block">📄</div>
              <div className="who">
                <span className="en-content">For any student applying for jobs</span>
                <span className="ta-content">வேலை விண்ணப்பிக்கும் மாணவர்</span>
              </div>
              <h3>
                <span className="en-content">Resume Builder</span>
                <span className="ta-content">ரெஸ்யூம் உருவாக்கி</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  ATS-friendly, recruiter-approved templates. Not the 2010
                  Word doc your senior gave you. Free forever.
                </span>
                <span className="ta-content">
                  ATS-க்கு ஏற்ற, recruiter அங்கீகரித்த templates. எப்போதும்
                  இலவசம்.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">12 modern templates</span>
                  <span className="ta-content">12 நவீன templates</span>
                </li>
                <li>
                  <span className="en-content">AI bullet point suggestions</span>
                  <span className="ta-content">AI வரிக்கோவை பரிந்துரை</span>
                </li>
                <li>
                  <span className="en-content">One-click PDF export</span>
                  <span className="ta-content">ஒரே கிளிக்கில் PDF</span>
                </li>
              </ul>
              <span className="status-chip soon">
                <span className="en-content">● Coming Jun 2026</span>
                <span className="ta-content">● ஜூன் 2026</span>
              </span>
            </article>

            {/* 6. Daily Job Alerts */}
            <article className="vertical-card c-coral">
              <div className="emoji-block">📣</div>
              <div className="who">
                <span className="en-content">For final-year &amp; early-career students</span>
                <span className="ta-content">இறுதியாண்டு &amp; புதிய வேலை தேடுபவர்</span>
              </div>
              <h3>
                <span className="en-content">Daily Job Alerts</span>
                <span className="ta-content">தினசரி வேலை அறிவிப்பு</span>
              </h3>
              <p className="desc">
                <span className="en-content">
                  Fresh openings, hackathons, internships, govt jobs — curated
                  for TN students, delivered daily on WhatsApp.
                </span>
                <span className="ta-content">
                  புதிய வேலை, hackathon, பயிற்சி, அரசு வேலை — WhatsApp-ல் தினமும்.
                </span>
              </p>
              <ul>
                <li>
                  <span className="en-content">Fresher roles (0–2 yrs)</span>
                  <span className="ta-content">புதியவர் வேலை (0–2 ஆண்டு)</span>
                </li>
                <li>
                  <span className="en-content">TN-based companies first</span>
                  <span className="ta-content">தமிழ்நாடு நிறுவனங்கள் முதலில்</span>
                </li>
                <li>
                  <span className="en-content">Govt job alerts (TNPSC, SSC)</span>
                  <span className="ta-content">அரசு வேலை அறிவிப்பு (TNPSC, SSC)</span>
                </li>
              </ul>
              <span className="status-chip soon">
                <span className="en-content">● Coming Jun 2026</span>
                <span className="ta-content">● ஜூன் 2026</span>
              </span>
            </article>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" aria-labelledby="how-heading">
          <div className="section-head">
            <span className="eyebrow">
              <span className="en-content">how it works</span>
              <span className="ta-content">எப்படி வேலை செய்கிறது</span>
            </span>
            <h2 id="how-heading">
              <span className="en-content">Four steps. Zero headache.</span>
              <span className="ta-content">நான்கு படிகள். தலைவலி இல்லை.</span>
            </h2>
          </div>

          <div className="steps">
            <div className="step-card">
              <div className="num">1</div>
              <h4>
                <span className="en-content">Join the waitlist</span>
                <span className="ta-content">Waitlist-ல் சேருங்கள்</span>
              </h4>
              <p>
                <span className="en-content">
                  Tell us your stage, goal, and interest. Takes 30 seconds.
                </span>
                <span className="ta-content">
                  உங்கள் நிலை, இலக்கு, ஆர்வத்தை சொல்லுங்கள். 30 விநாடி மட்டுமே.
                </span>
              </p>
            </div>
            <div className="step-card">
              <div className="num">2</div>
              <h4>
                <span className="en-content">Get your starter pack</span>
                <span className="ta-content">தொடக்க தொகுப்பை பெறுங்கள்</span>
              </h4>
              <p>
                <span className="en-content">
                  Free PYQs, cheat sheets, and a personalised prep plan on
                  WhatsApp.
                </span>
                <span className="ta-content">
                  இலவச PYQs, cheat sheets, தனிப்பயன் திட்டம் — WhatsApp-ல்.
                </span>
              </p>
            </div>
            <div className="step-card">
              <div className="num">3</div>
              <h4>
                <span className="en-content">Prep with weekly nudges</span>
                <span className="ta-content">வாராந்திர குறிப்புகளுடன் படியுங்கள்</span>
              </h4>
              <p>
                <span className="en-content">
                  One Tamil-first email + WhatsApp reminder every Sunday.
                  No spam.
                </span>
                <span className="ta-content">
                  வாரம் ஒருமுறை தமிழ் email + WhatsApp நினைவூட்டல். Spam இல்லை.
                </span>
              </p>
            </div>
            <div className="step-card">
              <div className="num">4</div>
              <h4>
                <span className="en-content">Match to the right college</span>
                <span className="ta-content">சரியான கல்லூரியை தேர்வு</span>
              </h4>
              <p>
                <span className="en-content">
                  After your score, get a ranked list of partner colleges —
                  free counselling call included.
                </span>
                <span className="ta-content">
                  மதிப்பெண்ணுக்குப் பிறகு, கல்லூரி பட்டியல் + இலவச ஆலோசனை அழைப்பு.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="section" aria-labelledby="why-heading">
          <div className="section-head">
            <span className="eyebrow">
              <span className="en-content">why campusvazhi</span>
              <span className="ta-content">ஏன் CampusVazhi</span>
            </span>
            <h2 id="why-heading">
              <span className="en-content">
                The guidance we wish we had in school.
              </span>
              <span className="ta-content">
                நாங்கள் பள்ளியில் கேட்க விரும்பிய வழிகாட்டி.
              </span>
            </h2>
          </div>

          <div className="why-grid">
            <div className="why-card a">
              <div className="icon" aria-hidden="true">🔍</div>
              <h3>
                <span className="en-content">Ruthless transparency</span>
                <span className="ta-content">முழு வெளிப்படை</span>
              </h3>
              <p>
                <span className="en-content">
                  Real cutoffs. Real placement data. Real fees — including the
                  hidden ones. We show you what consultants hide.
                </span>
                <span className="ta-content">
                  உண்மையான cutoff. உண்மையான placement தரவு. உண்மையான கட்டணம் —
                  மறைக்கப்பட்டவை உட்பட. ஆலோசகர்கள் மறைப்பதை நாங்கள் காட்டுவோம்.
                </span>
              </p>
            </div>
            <div className="why-card b">
              <div className="icon" aria-hidden="true">🗣️</div>
              <h3>
                <span className="en-content">Tamil-first, not translated</span>
                <span className="ta-content">தமிழ் முதலில், மொழிபெயர்ப்பு அல்ல</span>
              </h3>
              <p>
                <span className="en-content">
                  Every video, cheat sheet, and counselling call is built
                  Tamil-first by native speakers. Switch to English anytime.
                </span>
                <span className="ta-content">
                  ஒவ்வொரு வீடியோ, cheat sheet, ஆலோசனை அழைப்பும் தமிழ் முதலில்.
                  ஆங்கிலத்திற்கு எப்போது வேண்டுமானாலும் மாறலாம்.
                </span>
              </p>
            </div>
            <div className="why-card c">
              <div className="icon" aria-hidden="true">🎯</div>
              <h3>
                <span className="en-content">Outcome-obsessed</span>
                <span className="ta-content">முடிவுகளில் கவனம்</span>
              </h3>
              <p>
                <span className="en-content">
                  We measure success by your admit letter and first salary —
                  not by how many videos you watch. Built by IIM grads who
                  obsess over results.
                </span>
                <span className="ta-content">
                  உங்கள் admit letter மற்றும் முதல் சம்பளம் — அதுவே எங்கள் வெற்றி.
                  IIM பட்டதாரிகளால் உருவாக்கப்பட்டது.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* PARENTS */}
        <section className="parents-section" aria-labelledby="parents-heading">
          <div className="inner">
            <div>
              <span className="tag">
                <span className="en-content">● for parents</span>
                <span className="ta-content">● பெற்றோருக்கு</span>
              </span>
              <h3 id="parents-heading">
                <span className="en-content">
                  A plan you can actually trust with your child&rsquo;s future.
                </span>
                <span className="ta-content">
                  உங்கள் குழந்தையின் எதிர்காலத்திற்கு நம்பகமான திட்டம்.
                </span>
              </h3>
              <p className="lead">
                <span className="en-content">
                  We know how high the stakes feel. That&rsquo;s why our
                  counsellors speak Tamil, explain everything clearly, and
                  never recommend a college they can&rsquo;t back with data.
                </span>
                <span className="ta-content">
                  உங்கள் கவலையை நாங்கள் புரிந்து கொள்கிறோம். அதனால்தான் எங்கள்
                  ஆலோசகர்கள் தமிழில் தெளிவாக விளக்குகிறார்கள் — தரவு இல்லாமல்
                  எந்த கல்லூரியையும் பரிந்துரை செய்ய மாட்டோம்.
                </span>
              </p>
            </div>
            <div className="parent-checks">
              <div className="parent-check">
                <div className="tick" aria-hidden="true">✓</div>
                <div className="txt">
                  <span className="en-content">
                    <strong>No hidden fees.</strong> We&rsquo;re paid by colleges, not you.
                  </span>
                  <span className="ta-content">
                    <strong>மறைந்த கட்டணம் இல்லை.</strong> கல்லூரிகள் எங்களுக்கு
                    கட்டணம் கொடுக்கும்.
                  </span>
                </div>
              </div>
              <div className="parent-check">
                <div className="tick" aria-hidden="true">✓</div>
                <div className="txt">
                  <span className="en-content">
                    <strong>Counselling in Tamil.</strong> Call or WhatsApp — your choice.
                  </span>
                  <span className="ta-content">
                    <strong>தமிழில் ஆலோசனை.</strong> அழைப்பு அல்லது WhatsApp.
                  </span>
                </div>
              </div>
              <div className="parent-check">
                <div className="tick" aria-hidden="true">✓</div>
                <div className="txt">
                  <span className="en-content">
                    <strong>50+ verified colleges.</strong> No fly-by-night operators.
                  </span>
                  <span className="ta-content">
                    <strong>50+ சரிபார்க்கப்பட்ட கல்லூரிகள்.</strong> போலி
                    நிறுவனங்கள் இல்லை.
                  </span>
                </div>
              </div>
              <div className="parent-check">
                <div className="tick" aria-hidden="true">✓</div>
                <div className="txt">
                  <span className="en-content">
                    <strong>Built by IIM grads.</strong> We went through it ourselves.
                  </span>
                  <span className="ta-content">
                    <strong>IIM பட்டதாரிகளால்.</strong> நாங்களும் இந்த பயணத்தில்
                    சென்றவர்கள்.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" aria-labelledby="faq-heading">
          <div className="section-head">
            <span className="eyebrow">
              <span className="en-content">questions?</span>
              <span className="ta-content">கேள்விகள்?</span>
            </span>
            <h2 id="faq-heading">
              <span className="en-content">
                Everything students and parents ask us.
              </span>
              <span className="ta-content">
                மாணவர்களும் பெற்றோரும் கேட்கும் கேள்விகள்.
              </span>
            </h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item, idx) => (
              <details className="faq-item" key={idx}>
                <summary>
                  <h4>
                    <span className="en-content">{item.q}</span>
                    <span className="ta-content">{item.qTa}</span>
                  </h4>
                </summary>
                <p>
                  <span className="en-content">{item.a}</span>
                  <span className="ta-content">{item.aTa}</span>
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section" aria-labelledby="final-cta-heading">
          <div className="final-cta">
            <span className="sticker amber">
              <span className="en-content">● free · no spam · takes 30 seconds</span>
              <span className="ta-content">● இலவசம் · spam இல்லை · 30 விநாடி</span>
            </span>
            <h2 id="final-cta-heading">
              <span className="en-content">
                Your next chapter starts with one form.
              </span>
              <span className="ta-content">
                உங்கள் அடுத்த அத்தியாயம் ஒரு படிவத்துடன் தொடங்குகிறது.
              </span>
            </h2>
            <p>
              <span className="en-content">
                Join 1,000+ Tamil Nadu students who&rsquo;ve already joined the
                waitlist. Get your free TANCET starter pack on WhatsApp within
                minutes.
              </span>
              <span className="ta-content">
                1,000+ தமிழ்நாட்டு மாணவர்களுடன் இணையுங்கள். உங்கள் இலவச TANCET
                தொகுப்பு WhatsApp-ல் சில நிமிடங்களில்.
              </span>
            </p>
            <div className="signup">
              <LeadForm />
            </div>
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
