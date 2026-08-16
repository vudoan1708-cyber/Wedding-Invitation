import { NextResponse, after } from "next/server";
import { saveRsvp } from "@/lib/db";
import { notifyRsvp } from "@/lib/notify";
import type { Attendance } from "@/lib/types";

const MAX_NAME = 80;
const MAX_MESSAGE = 500;
const MAX_GUESTS = 10;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (name.length < 2 || name.length > MAX_NAME) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 },
    );
  }

  const attendance = data.attendance;
  if (attendance !== "joining" && attendance !== "not-joining") {
    return NextResponse.json(
      { error: "Please let us know if you can join." },
      { status: 400 },
    );
  }

  const rawGuests = Number(data.guests);
  const guests =
    attendance === "joining" && Number.isFinite(rawGuests)
      ? Math.min(Math.max(Math.trunc(rawGuests), 1), MAX_GUESTS)
      : attendance === "joining"
        ? 1
        : 0;

  const message =
    typeof data.message === "string" ? data.message.trim().slice(0, MAX_MESSAGE) : "";

  try {
    const { rsvp } = await saveRsvp({
      name,
      attendance: attendance as Attendance,
      guests,
      message,
    });
    // Sent after the response, so a slow mail API never delays the guest — and
    // notifyRsvp swallows its own errors, so it cannot cost them their reply.
    after(() => notifyRsvp(rsvp));
    // Deliberately identical whether this created or replaced a reply. Echoing
    // "updated" back would let anyone type a name and learn that this person
    // has already responded — a public decline list with extra steps.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not save your reply. Please try again." },
      { status: 500 },
    );
  }
}
