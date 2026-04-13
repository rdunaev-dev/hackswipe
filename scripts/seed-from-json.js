/**
 * Seeds the SQLite database from src/data/projects.json.
 * Run: node scripts/seed-from-json.js
 */

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", ".data");
const DB_PATH = process.env.HACKSWIPE_DB_PATH || path.join(DATA_DIR, "hackswipe.db");
const JSON_PATH = path.join(__dirname, "..", "src", "data", "projects.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id            TEXT PRIMARY KEY,
    epic_id       TEXT,
    title         TEXT NOT NULL,
    one_liner     TEXT NOT NULL DEFAULT '',
    cover_url     TEXT NOT NULL DEFAULT '',
    for_whom      TEXT NOT NULL DEFAULT '[]',
    who_affected  TEXT NOT NULL DEFAULT '[]',
    what_improves TEXT NOT NULL DEFAULT '[]',
    full_description TEXT NOT NULL DEFAULT '',
    demo_url      TEXT,
    repo_url      TEXT,
    youtrack_url  TEXT,
    authors       TEXT NOT NULL DEFAULT '[]',
    author_emails TEXT NOT NULL DEFAULT '[]',
    created_at    INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id           TEXT PRIMARY KEY,
    email        TEXT NOT NULL,
    google_id    TEXT,
    display_name TEXT,
    avatar_url   TEXT,
    session_size INTEGER NOT NULL DEFAULT 12,
    created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
    completed_at INTEGER
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);

  CREATE TABLE IF NOT EXISTS swipes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    project_id TEXT NOT NULL REFERENCES projects(id),
    direction  TEXT NOT NULL CHECK(direction IN ('left','right')),
    dice_roll  INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_swipes_session ON swipes(session_id);
  CREATE INDEX IF NOT EXISTS idx_swipes_project ON swipes(project_id);

  CREATE TABLE IF NOT EXISTS votes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    project_id TEXT NOT NULL REFERENCES projects(id),
    vote_type  TEXT NOT NULL CHECK(vote_type IN ('winner','honorable')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_winner ON votes(session_id) WHERE vote_type = 'winner';
  CREATE INDEX IF NOT EXISTS idx_votes_project ON votes(project_id);
`);

const projects = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

const stmt = db.prepare(`
  INSERT INTO projects (id, epic_id, title, one_liner, cover_url, for_whom, who_affected, what_improves, full_description, demo_url, repo_url, youtrack_url, authors, author_emails)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    epic_id=excluded.epic_id, title=excluded.title, one_liner=excluded.one_liner,
    cover_url=excluded.cover_url, for_whom=excluded.for_whom, who_affected=excluded.who_affected,
    what_improves=excluded.what_improves, full_description=excluded.full_description,
    demo_url=excluded.demo_url, repo_url=excluded.repo_url, youtrack_url=excluded.youtrack_url,
    authors=excluded.authors, author_emails=excluded.author_emails
`);

const tx = db.transaction(() => {
  for (const p of projects) {
    stmt.run(
      p.id,
      p.epicId || null,
      p.title,
      p.oneLiner,
      p.coverUrl,
      JSON.stringify(p.forWhom),
      JSON.stringify(p.whoAffected),
      JSON.stringify(p.whatImproves),
      p.fullDescription,
      p.demoUrl || null,
      p.repoUrl || null,
      p.youtrackUrl || null,
      JSON.stringify(p.authors),
      JSON.stringify(p.authorEmails),
    );
  }
});

tx();
console.log(`Seeded ${projects.length} projects into ${DB_PATH}`);
db.close();
