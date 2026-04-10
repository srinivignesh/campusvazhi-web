import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { leadSchema, normalizeIndianPhone } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Very light in-memory rate limit per IP (best-effort; resets on cold start).
// For serious abuse protection we'll put Cloudflare WAF rules in front.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: silent drop
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true, deduped: true }, { status: 200 });
  }

  const normalizedPhone = normalizeIndianPhone(data.phone);
  if (!normalizedPhone) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter a valid 10-digit Indian mobile number.",
      },
      { status: 400 }
    );
  }

  try {
    const supabase = getServerSupabase();

    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: normalizedPhone,
      college: data.college || null,
      current_status: data.current_status ?? null,
      interest: data.interest ?? "general",
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
      referrer: data.referrer ?? null,
      ip_address: ip,
      user_agent: req.headers.get("user-agent") ?? null,
    });

    if (error) {
      // Unique violation on phone = already signed up. Treat as success.
      if (error.code === "23505") {
        return NextResponse.json(
          { ok: true, deduped: true, message: "You're already on the list." },
          { status: 200 }
        );
      }
      console.error("[leads] insert error", error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[leads] unexpected error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
