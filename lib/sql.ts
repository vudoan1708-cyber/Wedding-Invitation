import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

/**
 * A tagged-template query function. Neon's driver already has this shape; the
 * local driver below is adapted to match, so lib/db.ts never knows which one it
 * is talking to.
 */
export type Sql = <T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<T[]>;

const isDev = process.env.NODE_ENV !== "production";

/**
 * Local mode is strictly opt-in. It deliberately does NOT fall back when
 * DATABASE_URL is missing — a misconfigured production must fail rather than
 * quietly write replies to a throwaway local file.
 */
export function usingLocalDatabase(): boolean {
  return process.env.USE_LOCAL_DB === "1";
}

/**
 * Real Postgres compiled to WASM, persisted to .pglite/ — so local work never
 * touches Neon, and `ON CONFLICT` behaves exactly as it does in production.
 *
 * Imported dynamically: PGlite is a devDependency, and this branch never runs
 * in production, so the module must not be resolved there.
 */
async function createLocalSql(): Promise<Sql> {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(path.join(process.cwd(), ".pglite"));
  await db.waitReady;
  await db.exec(
    await fs.readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8"),
  );

  return async <T>(strings: TemplateStringsArray, ...values: unknown[]) => {
    // Rebuild the template as a parameterised query: $1, $2, …
    const text = strings.reduce(
      (acc, part, index) =>
        acc + part + (index < values.length ? `$${index + 1}` : ""),
      "",
    );
    const result = await db.query<T>(text, values);
    return result.rows;
  };
}

function createNeonSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Server-side only — the API routes translate any failure into a neutral
    // message, so this detail never reaches a guest.
    throw new Error(
      isDev
        ? "DATABASE_URL is not set. Run `vercel env pull .env.local --yes`, or " +
          "set USE_LOCAL_DB=1 to use the local PGlite database instead."
        : "DATABASE_URL is not set.",
    );
  }
  return neon(url) as unknown as Sql;
}

/**
 * Cached on globalThis, not in a module variable. Next builds Server Components
 * and Route Handlers into separate module graphs, so a module-level cache would
 * give each of them its own PGlite instance over the same directory — they
 * would not see each other's writes, and two writers on one dataDir is
 * unsupported. globalThis is shared across both, and survives HMR.
 */
const globalForSql = globalThis as unknown as { __rsvpSql?: Promise<Sql> };

export function getSql(): Promise<Sql> {
  if (!globalForSql.__rsvpSql) {
    const local = usingLocalDatabase();
    if (isDev) {
      console.log(
        local
          ? "▸ RSVP storage: LOCAL PGlite database (.pglite) — Neon is not touched"
          : "▸ RSVP storage: Neon Postgres (live data)",
      );
    }
    globalForSql.__rsvpSql = local
      ? createLocalSql()
      : Promise.resolve(createNeonSql());
  }
  return globalForSql.__rsvpSql;
}
