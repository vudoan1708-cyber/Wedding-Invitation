-- Single source of truth for the schema. Applied to Neon by scripts/migrate.mjs
-- and to the local PGlite database automatically on first use.

CREATE TABLE IF NOT EXISTS rsvps (
  id         uuid PRIMARY KEY,
  name       text NOT NULL,
  name_key   text NOT NULL UNIQUE,
  attendance text NOT NULL CHECK (attendance IN ('joining', 'not-joining')),
  guests     integer NOT NULL DEFAULT 0,
  message    text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rsvps_updated_at_idx ON rsvps (updated_at DESC);
