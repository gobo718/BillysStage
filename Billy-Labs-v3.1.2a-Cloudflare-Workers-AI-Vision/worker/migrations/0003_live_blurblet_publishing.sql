PRAGMA foreign_keys = ON;

INSERT OR REPLACE INTO schema_meta (key, value) VALUES
  ('schema_version', '3'),
  ('app_version', '2.2.8');

CREATE INDEX IF NOT EXISTS idx_curator_blurblets_published_at
  ON curator_blurblets (published_at);
