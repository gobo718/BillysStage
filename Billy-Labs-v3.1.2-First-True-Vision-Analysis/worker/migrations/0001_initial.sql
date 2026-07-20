PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR REPLACE INTO schema_meta (key, value) VALUES
  ('schema_version', '1'),
  ('app_version', '2.2.6');

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  provider TEXT,
  provider_subject TEXT,
  display_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_subject)
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, setting_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mashup_progress (
  user_id TEXT NOT NULL,
  mashup_id TEXT NOT NULL,
  seen INTEGER NOT NULL DEFAULT 0 CHECK (seen IN (0, 1)),
  favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
  first_seen_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, mashup_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mashup_progress_user_seen
  ON mashup_progress (user_id, seen);
CREATE INDEX IF NOT EXISTS idx_mashup_progress_user_favorite
  ON mashup_progress (user_id, favorite);

CREATE TABLE IF NOT EXISTS blurblet_votes (
  user_id TEXT NOT NULL,
  mashup_id TEXT NOT NULL,
  vote_value INTEGER NOT NULL CHECK (vote_value IN (-1, 1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, mashup_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tier TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  is_secret INTEGER NOT NULL DEFAULT 0 CHECK (is_secret IN (0, 1)),
  published_version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL,
  mashup_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, mashup_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_collection_items_order
  ON collection_items (collection_id, position, mashup_id);

CREATE TABLE IF NOT EXISTS curator_blurblets (
  mashup_id TEXT PRIMARY KEY,
  draft_text TEXT NOT NULL DEFAULT '',
  published_text TEXT NOT NULL DEFAULT '',
  private_notes TEXT NOT NULL DEFAULT '',
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
