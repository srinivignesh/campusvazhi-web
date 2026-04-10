import { ImageResponse } from "next/og";

// Edge runtime for Vercel's dynamic OG image generation.
export const runtime = "edge";
export const alt =
  "CampusVazhi — Tamil Nadu's fresh path to college & career";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 60% 80% at 10% 0%, rgba(198, 255, 61, 0.25), transparent 60%), radial-gradient(ellipse 70% 60% at 90% 20%, rgba(255, 61, 127, 0.2), transparent 60%), #0B0820",
          color: "#FAFAFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#C6FF3D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(198, 255, 61, 0.4)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
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
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            <span>campus</span>
            <span style={{ color: "#C6FF3D" }}>vazhi</span>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: 980,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Tamil Nadu&rsquo;s new path</span>
            <span>
              to college is{" "}
              <span style={{ color: "#C6FF3D" }}>loading.</span>
            </span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(250, 250, 255, 0.7)",
              maxWidth: 900,
              display: "flex",
            }}
          >
            <span>
              TANCET, admissions, placements &amp; careers — in Tamil and English.
            </span>
          </div>
        </div>

        {/* Bottom: URL pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 600,
              color: "#B09FFF",
              display: "flex",
            }}
          >
            campusvazhi.com
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "#FF3D7F",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              color: "#0B0820",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            ⚡ Launching May 2026
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
