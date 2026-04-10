import type { MetadataRoute } from "next";

const SITE_URL = "https://campusvazhi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-IN": `${SITE_URL}/`,
          "ta-IN": `${SITE_URL}/?lang=ta`,
          "x-default": `${SITE_URL}/`,
        },
      },
    },
    // Future pages (phase B+) get added here:
    // - /tancet — TANCET resource hub
    // - /colleges — programmatic college directory
    // - /mba-admissions
    // - /placements
    // - /study-abroad
    // - /parents
    // - /about
  ];
}
