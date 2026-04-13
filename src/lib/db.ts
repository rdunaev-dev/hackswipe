import postgres from "postgres";
import { Project } from "./types";

let _sql: ReturnType<typeof postgres> | null = null;

function getSql() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL or POSTGRES_URL env var is required");
  _sql = postgres(url, { ssl: "prefer" });
  return _sql;
}

let _schemaReady = false;

async function ensureSchema() {
  if (_schemaReady) return;
  const sql = getSql();

  await sql`
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
      created_at    INTEGER NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::INTEGER)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id           TEXT PRIMARY KEY,
      email        TEXT NOT NULL,
      google_id    TEXT,
      display_name TEXT,
      avatar_url   TEXT,
      session_size INTEGER NOT NULL DEFAULT 12,
      created_at   INTEGER NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::INTEGER),
      completed_at INTEGER
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email)`;

  await sql`
    CREATE TABLE IF NOT EXISTS swipes (
      id         SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      direction  TEXT NOT NULL CHECK(direction IN ('left','right')),
      dice_roll  INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::INTEGER)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_swipes_session ON swipes(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_swipes_project ON swipes(project_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id         SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      vote_type  TEXT NOT NULL CHECK(vote_type IN ('winner','honorable')),
      created_at INTEGER NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::INTEGER)
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_winner ON votes(session_id) WHERE vote_type = 'winner'`;
  await sql`CREATE INDEX IF NOT EXISTS idx_votes_project ON votes(project_id)`;

  _schemaReady = true;
}

// ─── Helpers ───

function rowToProject(r: Record<string, unknown>): Project {
  return {
    id: r.id as string,
    epicId: r.epic_id as string | undefined,
    title: r.title as string,
    oneLiner: r.one_liner as string,
    coverUrl: r.cover_url as string,
    forWhom: JSON.parse(r.for_whom as string),
    whoAffected: JSON.parse(r.who_affected as string),
    whatImproves: JSON.parse(r.what_improves as string),
    fullDescription: r.full_description as string,
    demoUrl: r.demo_url as string | undefined,
    repoUrl: r.repo_url as string | undefined,
    youtrackUrl: r.youtrack_url as string | undefined,
    authors: JSON.parse(r.authors as string),
    authorEmails: JSON.parse(r.author_emails as string),
  };
}

export interface DbSession {
  id: string;
  email: string;
  googleId: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  sessionSize: number;
  createdAt: number;
  completedAt: number | null;
}

function rowToSession(r: Record<string, unknown>): DbSession {
  return {
    id: r.id as string,
    email: r.email as string,
    googleId: r.google_id as string | null,
    displayName: r.display_name as string | null,
    avatarUrl: r.avatar_url as string | null,
    sessionSize: Number(r.session_size),
    createdAt: Number(r.created_at),
    completedAt: r.completed_at ? Number(r.completed_at) : null,
  };
}

// ─── Project CRUD ───

export async function upsertProject(p: Project) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO projects (id, epic_id, title, one_liner, cover_url, for_whom, who_affected, what_improves, full_description, demo_url, repo_url, youtrack_url, authors, author_emails)
    VALUES (${p.id}, ${p.epicId ?? null}, ${p.title}, ${p.oneLiner}, ${p.coverUrl},
            ${JSON.stringify(p.forWhom)}, ${JSON.stringify(p.whoAffected)}, ${JSON.stringify(p.whatImproves)},
            ${p.fullDescription}, ${p.demoUrl ?? null}, ${p.repoUrl ?? null}, ${p.youtrackUrl ?? null},
            ${JSON.stringify(p.authors)}, ${JSON.stringify(p.authorEmails)})
    ON CONFLICT(id) DO UPDATE SET
      epic_id=EXCLUDED.epic_id, title=EXCLUDED.title, one_liner=EXCLUDED.one_liner,
      cover_url=EXCLUDED.cover_url, for_whom=EXCLUDED.for_whom, who_affected=EXCLUDED.who_affected,
      what_improves=EXCLUDED.what_improves, full_description=EXCLUDED.full_description,
      demo_url=EXCLUDED.demo_url, repo_url=EXCLUDED.repo_url, youtrack_url=EXCLUDED.youtrack_url,
      authors=EXCLUDED.authors, author_emails=EXCLUDED.author_emails
  `;
}

export async function getAllProjects(): Promise<Project[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at`;
  return rows.map(rowToProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  return rows.length > 0 ? rowToProject(rows[0]) : null;
}

// ─── Session CRUD ───

export async function findSessionByEmail(email: string): Promise<DbSession | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT * FROM sessions WHERE email = ${email.toLowerCase()}`;
  return rows.length > 0 ? rowToSession(rows[0]) : null;
}

export async function createDbSession(
  id: string,
  email: string,
  googleId: string | null,
  displayName: string | null,
  avatarUrl: string | null,
  sessionSize: number,
): Promise<DbSession> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO sessions (id, email, google_id, display_name, avatar_url, session_size)
    VALUES (${id}, ${email.toLowerCase()}, ${googleId}, ${displayName}, ${avatarUrl}, ${sessionSize})
  `;
  return (await findSessionByEmail(email))!;
}

export async function completeSession(sessionId: string) {
  await ensureSchema();
  const sql = getSql();
  await sql`UPDATE sessions SET completed_at = EXTRACT(EPOCH FROM NOW())::INTEGER WHERE id = ${sessionId}`;
}

// ─── Swipe CRUD ───

export async function recordSwipe(
  sessionId: string,
  projectId: string,
  direction: "left" | "right",
  diceRoll: number,
) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO swipes (session_id, project_id, direction, dice_roll)
    VALUES (${sessionId}, ${projectId}, ${direction}, ${diceRoll})
  `;
}

export async function getSwipesBySession(sessionId: string) {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT project_id, direction, dice_roll
    FROM swipes WHERE session_id = ${sessionId} ORDER BY created_at
  `;
  return rows as unknown as { project_id: string; direction: "left" | "right"; dice_roll: number }[];
}

export async function getSeenProjectIds(sessionId: string): Promise<Set<string>> {
  const swipes = await getSwipesBySession(sessionId);
  return new Set(swipes.map((s) => s.project_id));
}

export async function getBankProjectIds(sessionId: string): Promise<string[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT project_id FROM swipes
    WHERE session_id = ${sessionId} AND direction = 'right'
    ORDER BY created_at
  `;
  return rows.map((r) => r.project_id as string);
}

// ─── Vote CRUD ───

export async function castVote(sessionId: string, winnerId: string, honorableIds: string[]) {
  await ensureSchema();
  const sql = getSql();
  await sql.begin(async (tx) => {
    await tx`INSERT INTO votes (session_id, project_id, vote_type) VALUES (${sessionId}, ${winnerId}, 'winner')`;
    for (const hId of honorableIds) {
      await tx`INSERT INTO votes (session_id, project_id, vote_type) VALUES (${sessionId}, ${hId}, 'honorable')`;
    }
    await tx`UPDATE sessions SET completed_at = EXTRACT(EPOCH FROM NOW())::INTEGER WHERE id = ${sessionId}`;
  });
}

export async function hasVoted(sessionId: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT 1 FROM votes WHERE session_id = ${sessionId} AND vote_type = 'winner' LIMIT 1`;
  return rows.length > 0;
}

export async function hasVotedByEmail(email: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT 1 FROM votes v JOIN sessions s ON v.session_id = s.id
    WHERE s.email = ${email.toLowerCase()} AND v.vote_type = 'winner' LIMIT 1
  `;
  return rows.length > 0;
}

// ─── Stats ───

export async function getProjectTimesShown(): Promise<Map<string, number>> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT project_id, COUNT(*) as cnt FROM swipes GROUP BY project_id`;
  return new Map(rows.map((r) => [r.project_id as string, Number(r.cnt)]));
}

export async function getFullStats() {
  await ensureSchema();
  const sql = getSql();

  const totalRes = await sql`SELECT COUNT(*) as cnt FROM votes WHERE vote_type = 'winner'`;
  const totalVoters = Number(totalRes[0].cnt);

  const projects = await getAllProjects();

  const fvRows = await sql`SELECT project_id, COUNT(*) as cnt FROM votes WHERE vote_type = 'winner' GROUP BY project_id`;
  const fvMap = new Map(fvRows.map((r) => [r.project_id as string, Number(r.cnt)]));

  const hmRows = await sql`SELECT project_id, COUNT(*) as cnt FROM votes WHERE vote_type = 'honorable' GROUP BY project_id`;
  const hmMap = new Map(hmRows.map((r) => [r.project_id as string, Number(r.cnt)]));

  const shownRows = await sql`SELECT project_id, COUNT(*) as cnt FROM swipes GROUP BY project_id`;
  const shownMap = new Map(shownRows.map((r) => [r.project_id as string, Number(r.cnt)]));

  const bankRows = await sql`SELECT project_id, COUNT(*) as cnt FROM swipes WHERE direction = 'right' GROUP BY project_id`;
  const bankMap = new Map(bankRows.map((r) => [r.project_id as string, Number(r.cnt)]));

  const result = projects.map((p) => {
    const ts = shownMap.get(p.id) ?? 0;
    const tb = bankMap.get(p.id) ?? 0;
    return {
      projectId: p.id,
      title: p.title,
      finalVotes: fvMap.get(p.id) ?? 0,
      honorableMentions: hmMap.get(p.id) ?? 0,
      timesInBank: tb,
      timesShown: ts,
      timesSwipedRight: tb,
      bankRate: ts > 0 ? Math.round((tb / ts) * 100) : 0,
    };
  });

  result.sort((a, b) => b.finalVotes - a.finalVotes);
  return { totalVoters, projects: result };
}

// ─── Seed from JSON ───

export async function seedFromJson(projects: Project[]) {
  await ensureSchema();
  const sql = getSql();
  await sql.begin(async (tx) => {
    for (const p of projects) {
      await tx`
        INSERT INTO projects (id, epic_id, title, one_liner, cover_url, for_whom, who_affected, what_improves, full_description, demo_url, repo_url, youtrack_url, authors, author_emails)
        VALUES (${p.id}, ${p.epicId ?? null}, ${p.title}, ${p.oneLiner}, ${p.coverUrl},
                ${JSON.stringify(p.forWhom)}, ${JSON.stringify(p.whoAffected)}, ${JSON.stringify(p.whatImproves)},
                ${p.fullDescription}, ${p.demoUrl ?? null}, ${p.repoUrl ?? null}, ${p.youtrackUrl ?? null},
                ${JSON.stringify(p.authors)}, ${JSON.stringify(p.authorEmails)})
        ON CONFLICT(id) DO UPDATE SET
          epic_id=EXCLUDED.epic_id, title=EXCLUDED.title, one_liner=EXCLUDED.one_liner,
          cover_url=EXCLUDED.cover_url, for_whom=EXCLUDED.for_whom, who_affected=EXCLUDED.who_affected,
          what_improves=EXCLUDED.what_improves, full_description=EXCLUDED.full_description,
          demo_url=EXCLUDED.demo_url, repo_url=EXCLUDED.repo_url, youtrack_url=EXCLUDED.youtrack_url,
          authors=EXCLUDED.authors, author_emails=EXCLUDED.author_emails
      `;
    }
  });
}
