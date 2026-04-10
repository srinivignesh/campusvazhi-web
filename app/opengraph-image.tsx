import { ImageResponse } from "next/og";

// Edge runtime for Vercel's dynamic OG image generation.
export const runtime = "edge";
export const alt =
  "CampusVazhi — Tamil Nadu's fresh path to college & career";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Phase B palette — bright cream with vivid accents. Mirrors globals.css.
const INK = "#1A0B2E";
const CREAM = "#FFF5E1";
const PINK = "#FF2E63";
const AMBER = "#FFBE0B";
const MINT = "#06D6A0";
const INDIGO = "#5D3FD3";

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
          padding: "72px",
          background: CREAM,
          color: INK,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative floating shapes — giving it the neo-brutalist vibe */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 100,
            width: 80,
            height: 80,
            borderRadius: 20,
            background: AMBER,
            border: `3px solid ${INK}`,
            boxShadow: `8px 8px 0 ${INK}`,
            transform: "rotate(12deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
          }}
        >
          🎓
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 160,
            right: 80,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: MINT,
            border: `3px solid ${INK}`,
            boxShadow: `6px 6px 0 ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          ✨
        </div>

        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 16,
              background: PINK,
              border: `3px solid ${INK}`,
              boxShadow: `5px 5px 0 ${INK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 17 L6 11 Q6 7 10 7 L14 7"
                stroke="#FFFFFF"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M12 4.5 L16 7 L13.5 11"
                stroke="#FFFFFF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              display: "flex",
              color: INK,
            }}
          >
            <span>campus</span>
            <span style={{ color: PINK }}>vazhi</span>
          </div>
        </div>

        {/* Middle: headline with highlighted spans */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              maxWidth: 1000,
              display: "flex",
              flexDirection: "column",
              color: INK,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span>Your&nbsp;</span>
              <span
                style={{
                  background: PINK,
                  color: "#FFFFFF",
                  padding: "4px 18px",
                  borderRadius: 12,
                  border: `3px solid ${INK}`,
                  display: "flex",
                }}
              >
                college.
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", marginTop: 14 }}>
              <span>Your&nbsp;</span>
              <span
                style={{
                  background: MINT,
                  color: INK,
                  padding: "4px 18px",
                  borderRadius: 12,
                  border: `3px solid ${INK}`,
                  display: "flex",
                }}
              >
                rules.
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#453357",
              maxWidth: 900,
              display: "flex",
              fontWeight: 500,
              marginTop: 6,
            }}
          >
            <span>
              TANCET, admissions, placements &amp; careers — in Tamil and English.
            </span>
          </div>
        </div>

        {/* Bottom: URL + launch pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "14px 24px",
              background: "#FFFFFF",
              border: `3px solid ${INK}`,
              boxShadow: `5px 5px 0 ${INK}`,
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 700,
              color: INK,
              display: "flex",
            }}
          >
            campusvazhi.com
          </div>
          <div
            style={{
              padding: "14px 24px",
              background: INDIGO,
              border: `3px solid ${INK}`,
              boxShadow: `5px 5px 0 ${INK}`,
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              color: "#FFFFFF",
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
