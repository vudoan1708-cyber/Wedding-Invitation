"use client";

import { useState } from "react";
import { Divider } from "./Ornament";
import { coupleShort, wedding } from "@/lib/wedding";
import type { Attendance } from "@/lib/types";

const MAX_GUESTS = 6;

export function RsvpForm() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Attendance | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Please enter your name so we know who is replying.");
      return;
    }
    if (!attendance) {
      setError("Please choose one of the two replies above.");
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, guests, message }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setConfirmed(attendance);
      setStatus("done");
    } catch {
      setError("We could not reach the server. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done" && confirmed) {
    return (
      <div className="text-center">
        <Divider className="mb-8" />
        <p className="font-script text-4xl text-gold sm:text-5xl">
          {confirmed === "joining" ? "Thank you" : "With love"}
        </p>
        <p className="mt-5 font-serif text-lg leading-relaxed text-ink sm:text-xl">
          {confirmed === "joining" ? (
            <>
              Your reply is with us, {name.trim()}. We cannot wait to celebrate
              beside you in {wedding.location.city}.
            </>
          ) : (
            <>
              Thank you for letting us know, {name.trim()}. You will be missed
              dearly, and we will be thinking of you on the day.
            </>
          )}
        </p>
        <p className="mt-6 font-sans text-xs tracking-[0.18em] text-ink-soft uppercase">
          Seen only by {coupleShort}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setConfirmed(null);
          }}
          className="mt-8 font-sans text-xs tracking-[0.2em] text-ink-soft uppercase underline decoration-gold/50 underline-offset-8 transition hover:text-gold"
        >
          Change my reply
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <Divider className="mb-8" />

      <p className="font-script text-4xl text-gold sm:text-5xl">Will you join us?</p>
      <p className="mt-4 font-serif text-base text-ink-soft sm:text-lg">
        {wedding.rsvpBy}
      </p>

      <div className="mx-auto mt-10 max-w-md text-left">
        <label
          htmlFor="rsvp-name"
          className="block font-sans text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase"
        >
          Your full name
        </label>
        <input
          id="rsvp-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="As you would like it written"
          className="mt-3 w-full border-b border-gold/40 bg-transparent pb-2 font-serif text-xl text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
        />
      </div>

      <fieldset className="mx-auto mt-10 max-w-md">
        <legend className="sr-only">Your reply</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <ChoiceCard
            selected={attendance === "joining"}
            onSelect={() => setAttendance("joining")}
            title="Joyfully accepts"
            caption="I will be there"
          />
          <ChoiceCard
            selected={attendance === "not-joining"}
            onSelect={() => setAttendance("not-joining")}
            title="Regretfully declines"
            caption="Celebrating from afar"
          />
        </div>
      </fieldset>

      {attendance === "joining" && (
        <div className="mx-auto mt-10 max-w-md text-left">
          <span className="block font-sans text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase">
            Including you, how many will attend?
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: MAX_GUESTS }, (_, index) => index + 1).map(
              (count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setGuests(count)}
                  aria-pressed={guests === count}
                  className={`h-11 w-11 border font-serif text-lg transition ${
                    guests === count
                      ? "border-gold bg-gold/15 text-ink"
                      : "border-gold/30 text-ink-soft hover:border-gold/60"
                  }`}
                >
                  {count}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {attendance && (
        <div className="mx-auto mt-10 max-w-md text-left">
          <label
            htmlFor="rsvp-message"
            className="block font-sans text-[0.7rem] tracking-[0.22em] text-ink-soft uppercase"
          >
            A note for {coupleShort}{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="rsvp-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder={
              attendance === "joining"
                ? "A wish, a song request, anything at all"
                : "Send your love, or a word about the day"
            }
            className="mt-3 w-full resize-none border-b border-gold/40 bg-transparent pb-2 font-serif text-lg text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
          />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-8 font-serif text-base text-[#a4553f]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-10 border border-gold px-12 py-4 font-sans text-[0.7rem] tracking-[0.28em] text-ink uppercase transition hover:bg-gold hover:text-paper disabled:opacity-50"
      >
        {status === "saving" ? "Sending" : "Send reply"}
      </button>

      <p className="mx-auto mt-8 max-w-md font-serif text-sm leading-relaxed text-ink-soft">
        Your reply is private. Only {coupleShort} will ever see it — there is no
        guest list on this page, and no one else can see who has replied or what
        they chose.
      </p>
    </form>
  );
}

function ChoiceCard({
  selected,
  onSelect,
  title,
  caption,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  caption: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative border px-6 py-6 text-center transition ${
        selected
          ? "border-gold bg-gold/10"
          : "border-gold/30 hover:border-gold/70 hover:bg-gold/5"
      }`}
    >
      <span className="block font-serif text-xl text-ink">{title}</span>
      <span className="mt-2 block font-sans text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
        {caption}
      </span>
      <span
        aria-hidden="true"
        className={`absolute top-3 right-3 h-1.5 w-1.5 rotate-45 transition ${
          selected ? "bg-gold" : "bg-transparent"
        }`}
      />
    </button>
  );
}
