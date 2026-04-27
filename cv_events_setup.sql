-- ============================================================
-- CampusVazhi — cv_events table setup
-- Run this once in Supabase SQL Editor:
-- supabase.com → your project → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS cv_events (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   timestamptz DEFAULT now(),
  session_id   text,
  event_type   text        NOT NULL,   -- page_view | cta_click | download_click | faq_expand | outbound_click | form_submit | page_exit
  page         text,                   -- filename, e.g. "index.html" or "CampusVazhi-CAT-2026.html"
  device       text,                   -- "mobile" | "desktop"
  metadata     jsonb       DEFAULT '{}' -- flexible payload per event type
);

-- 2. Index for fast admin queries
CREATE INDEX IF NOT EXISTS idx_cv_events_created  ON cv_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_events_type     ON cv_events (event_type);
CREATE INDEX IF NOT EXISTS idx_cv_events_page     ON cv_events (page);
CREATE INDEX IF NOT EXISTS idx_cv_events_session  ON cv_events (session_id);

-- 3. Enable Row Level Security
ALTER TABLE cv_events ENABLE ROW LEVEL SECURITY;

-- 4. Allow anonymous users to INSERT (the tracker uses the anon key)
CREATE POLICY "cv_events_anon_insert"
  ON cv_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Allow service_role to SELECT all rows (admin console uses service key)
CREATE POLICY "cv_events_service_select"
  ON cv_events
  FOR SELECT
  TO service_role
  USING (true);

-- 6. (Optional) Auto-clean events older than 90 days — uncomment if you want this
-- DELETE FROM cv_events WHERE created_at < now() - interval '90 days';

-- ── DONE ──────────────────────────────────────────────────
-- After running this, deploy cv-track.js and open any CampusVazhi page.
-- Events will appear under Admin → Behaviour tab within seconds.
