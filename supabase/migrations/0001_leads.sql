-- ============================================================================
-- CampusVazhi — leads table
-- Captures early-access signups from the holding page & homepage.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- identity
  name            text not null,
  phone           text not null,
  college         text,

  -- segmentation
  current_status  text check (
    current_status in (
      'school_student',
      'ug_student',
      'pg_student',
      'working_professional',
      'parent',
      'other'
    )
  ),
  interest        text not null default 'general' check (
    interest in ('tancet','admissions','placements','careers','general')
  ),

  -- attribution
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  referrer        text,

  -- metadata (for abuse / debugging)
  ip_address      text,
  user_agent      text,

  -- ops
  status          text not null default 'new' check (
    status in ('new','contacted','qualified','converted','spam','do_not_contact')
  ),
  notes           text
);

-- One row per phone number. Second submission = dedupe (23505).
create unique index if not exists leads_phone_unique_idx on public.leads (phone);

-- Handy query indexes
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_interest_idx on public.leads (interest);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_utm_source_idx on public.leads (utm_source);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- Writes happen via the service_role key in a Next.js API route,
-- so we lock the anon role out completely. No public reads, no public inserts.
-- ============================================================================
alter table public.leads enable row level security;

-- No policies = no anon access. service_role bypasses RLS by design.

-- (Optional) convenience view for the ops dashboard — just the non-PII columns.
create or replace view public.leads_overview as
  select id, created_at, current_status, interest, utm_source, utm_campaign, status
  from public.leads;
