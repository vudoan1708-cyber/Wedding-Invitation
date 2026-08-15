/**
 * Applies db/schema.sql to the Neon database. Idempotent — safe to re-run.
 *
 *   node --env-file=.env.local scripts/migrate.mjs
 *
 * The local PGlite database needs no migration step; it applies the same file
 * automatically on first use.
 */
import { promises as fs } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set. Run `vercel env pull .env.local --yes` first.",
  );
  process.exit(1);
}

const sql = neon(url);
const host = new URL(url).host;

await sql.query(await fs.readFile("db/schema.sql", "utf8"));

const [{ count }] = await sql`SELECT count(*)::int AS count FROM rsvps`;
console.log(
  `Schema applied to Neon (${host}) — ${count} repl${count === 1 ? "y" : "ies"}.`,
);
