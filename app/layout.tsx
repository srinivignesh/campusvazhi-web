import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://campusvazhi.com";
const SITE_NAME = "CampusVazhi";
const DEFAULT_TITLE =
  "CampusVazhi — Tamil Nadu's fresh path to college & career";
const DEFAULT_DESCRIPTION =
  "No shady consultants. No confusion. Real guidance for college admissions, TANCET, placements & careers — built for Tamil Nadu students, in Tamil and English.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · CampusVazhi",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "CampusVazhi Team", url: SITE_URL }],
  creator: "CampusVazhi",
  publisher: "CampusVazhi",
  keywords: [
    "CampusVazhi",
    "TANCET 2026",
    "Tamil Nadu college admissions",
    "MBA admissions Tamil Nadu",
    "Anna University TANCET",
    "placements Tamil Nadu",
    "free TANCET mock tests",
    "TANCET preparation in Tamil",
  ],
  category: "education",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "ta-IN": "/?lang=ta",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["ta_IN"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CampusVazhi — Tamil Nadu's fresh path to college & career",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    // Pinterest / generic rich pin hints
    "pinterest-rich-pin": "true",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0820",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// -- Structured data (JSON-LD) ------------------------------------------------
// Kept in the root layout so every page inherits Organization + WebSite context.
// AI search engines (Google AI Overviews, Perplexity, ChatGPT, Claude) heavily
// weigh these signals — they let the crawler cite the site by name with
// unambiguous attribution.

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}#organization`,
  name: SITE_NAME,
  alternateName: "கேம்பஸ்வழி",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: DEFAULT_DESCRIPTION,
  foundingDate: "2026",
  areaServed: {
    "@type": "State",
    name: "Tamil Nadu",
    containedInPlace: { "@type": "Country", name: "India" },
  },
  knowsLanguage: ["en", "ta"],
  knowsAbout: [
    "TANCET 2026",
    "MBA admissions",
    "College counselling",
    "Campus placements",
    "Resume building",
    "Study abroad guidance",
  ],
  sameAs: [
    // Fill in when live
    // "https://www.linkedin.com/company/campusvazhi",
    // "https://www.instagram.com/campusvazhi",
    // "https://www.youtube.com/@campusvazhi",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@campusvazhi.com",
    availableLanguage: ["en", "ta"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  inLanguage: ["en-IN", "ta-IN"],
  publisher: { "@id": `${SITE_URL}#organization` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}

        {/* JSON-LD: Organization */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* JSON-LD: WebSite */}
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
