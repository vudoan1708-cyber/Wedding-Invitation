import crypto from "node:crypto";
import { getSql } from "./sql";
import type { Attendance, Rsvp } from "./types";

/** Collapses stray whitespace so the dashboard shows "Anh Tuan", not "Anh   Tuan". */
function tidy(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/** Loose match so "  Anh   Tuan " and "anh tuan" count as the same guest. */
function normalise(name: string): string {
  return tidy(name).toLowerCase();
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  created_at: string | Date;
  updated_at: string | Date;
};

function toRsvp(row: Row): Rsvp {
  return {
    id: row.id,
    name: row.name,
    attendance: row.attendance,
    guests: Number(row.guests),
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listRsvps(): Promise<Rsvp[]> {
  const sql = await getSql();
  const rows = (await sql`
    SELECT id, name, attendance, guests, message, created_at, updated_at
      FROM rsvps
     ORDER BY updated_at DESC
  `) as Row[];
  return rows.map(toRsvp);
}

export type SaveRsvpInput = {
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
};

/**
 * Upsert keyed on the normalised name, so a guest can revise their reply.
 * The unique index makes this atomic across every serverless instance — two
 * guests replying at the same moment cannot lose each other's answer.
 */
export async function saveRsvp(input: SaveRsvpInput): Promise<{ rsvp: Rsvp }> {
  const sql = await getSql();
  const rows = (await sql`
    INSERT INTO rsvps (id, name, name_key, attendance, guests, message)
         VALUES (${crypto.randomUUID()}, ${tidy(input.name)},
                 ${normalise(input.name)}, ${input.attendance},
                 ${input.guests}, ${input.message})
    ON CONFLICT (name_key) DO UPDATE
            SET name = EXCLUDED.name,
                attendance = EXCLUDED.attendance,
                guests = EXCLUDED.guests,
                message = EXCLUDED.message,
                updated_at = now()
      RETURNING id, name, attendance, guests, message, created_at, updated_at
  `) as Row[];

  return { rsvp: toRsvp(rows[0]) };
}

export async function deleteRsvp(id: string): Promise<boolean> {
  // Guard first: a non-uuid would make Postgres throw rather than return empty.
  if (!UUID.test(id)) return false;
  const sql = await getSql();
  const rows = (await sql`
    DELETE FROM rsvps WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}
