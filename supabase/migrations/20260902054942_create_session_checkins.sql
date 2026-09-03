/*
# Create session_checkins table (single-tenant, no auth)

1. New Tables
- `session_checkins`
  - `id` (uuid, primary key, auto-generated)
  - `feeling` (text, not null) — one of: 'calm', 'off', 'stressed', 'exhausted'
  - `cause` (text, nullable) — one of: 'physical', 'personal_stress', 'post_loss', 'fomo', 'other' — null when feeling is 'calm'
  - `action` (text, not null) — one of: 'cleared', 'hard_block', 'cooldown', 'soft_warning'
  - `block_until` (timestamptz, nullable) — timestamp when a hard block or cooldown expires; null for cleared/soft_warning
  - `acknowledged` (boolean, default false) — true when user acknowledged a soft warning
  - `created_at` (timestamptz, default now()) — check-in timestamp
  - `message` (text, nullable) — the vault response message shown to the user

2. Purpose
Persists every pre-session check-in for Leon's Vault. The app reads the most
recent check-in on load to determine whether platform access is currently
restricted (hard block or cooldown) or cleared.

3. Security
- Enable RLS on `session_checkins`.
- Single-tenant app with no sign-in screen: allow anon + authenticated CRUD
  so the anon-key frontend can read and write its own check-in records.
*/

CREATE TABLE IF NOT EXISTS session_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feeling text NOT NULL,
  cause text,
  action text NOT NULL,
  block_until timestamptz,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  message text
);

ALTER TABLE session_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_checkins" ON session_checkins;
CREATE POLICY "anon_select_checkins" ON session_checkins FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_checkins" ON session_checkins;
CREATE POLICY "anon_insert_checkins" ON session_checkins FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_checkins" ON session_checkins;
CREATE POLICY "anon_update_checkins" ON session_checkins FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_checkins" ON session_checkins;
CREATE POLICY "anon_delete_checkins" ON session_checkins FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_session_checkins_created_at
  ON session_checkins (created_at DESC);