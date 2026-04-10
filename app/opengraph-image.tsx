import { ImageResponse } from "next/og";

// Edge runtime for Vercel's dynamic OG image generation.
export const runtime = "edge";
export const alt =
  "CampusVazhi — Tamil Nadu's fresh path to college & career";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Professional education palette — navy primary, white surface,
// amber accent. Mirrors globals.css tokens.
const INK = "#0F172A";          // slate-900
const INK_2 = "#334155";        // slate-700
const BG = "#FFFFFF";
const BG_2 = "#F8FAFC";         // slate-50
const PRIMARY = "#0B2545";      // deep navy
const PRIMARY_2 = "#13315C";
const PRIMARY_TINT = "#F2F5F9";
const PRIMARY_SOFT = "#E6EBF2";
const ACCENT = "#B45309";       // amber-700
const ACCENT_SOFT = "#FEF3C7";
const BORDER = "#E2E8F0";       // slate-200

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
          padding: "72px 80px",
          background: BG,
          backgroundImage: `linear-gradient(135deg, ${BG} 0%, ${BG_2} 100%)`,
          color: INK,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle top accent rule — restrained, not neo-brutalist */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: PRIMARY,
            display: "flex",
          }}
        />

        {/* Very subtle decorative navy circle, bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 600,
            background: PRIMARY_TINT,
            display: "flex",
          }}
        />

        {/* Subtle amber accent mark, top-right */}
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            background: ACCENT_SOFT,
            border: `1px solid ${ACCENT}`,
            borderRadius: 999,
            color: ACCENT,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          TANCET 2026 · May 9
        </div>

        {/* Top row: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 14,
              background: PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 2px 8px rgba(15, 23, 42, 0.12)`,
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 17 L6 11 Q6 7 10 7 L14 7"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M12 4.5 L16 7 L13.5 11"
                stroke="#FFFFFF"
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
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            campus<span style={{ color: PRIMARY }}>vazhi</span>
          </div>
        </div>

        {/* Middle: main claim */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: INK,
              display: "flex",
              flexDirection: "column",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex" }}>Your college.</div>
            <div style={{ display: "flex" }}>Your career.</div>
            <div style={{ display: "flex", color: PRIMARY }}>
              Your rules.
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.5,
              color: INK_2,
              maxWidth: 880,
              display: "flex",
            }}
          >
            Free TANCET prep, MBA admissions, placements & study abroad — in
            Tamil and English. Built by IIM grads.
          </div>
        </div>

        {/* Bottom row: URL + badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "14px 26px",
              background: BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              color: INK,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 1px 3px rgba(15, 23, 42, 0.06)`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: ACCENT,
                display: "flex",
              }}
            />
            campusvazhi.com
          </div>
          <div
            style={{
              padding: "14px 24px",
              background: PRIMARY,
              border: `1px solid ${PRIMARY_2}`,
              borderRadius: 999,
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            Launching May 2026 · Free forever
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
