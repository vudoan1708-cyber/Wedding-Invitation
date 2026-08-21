"use client";

import { useEffect, useRef, useState } from "react";
import { Envelope } from "./Envelope";
import { InvitationLetter } from "./InvitationLetter";
import { AmbientPetals, MonogramDraw } from "./Intro";

type Phase = "intro" | "sealed" | "opening" | "open";

/**
 * How long the initials hold before the envelope arrives. The stroke finishes at
 * ~2.5s and the filled monogram settles by ~3.4s, so this leaves a short beat.
 */
const INTRO_MS = 3900;

/** When the envelope layer is finally unmounted, well after the letter is up. */
const HANDOFF_MS = 1900;

/**
 * The letter starts rising while the envelope is still dissolving. Without this
 * overlap there is a frame of bare background between the two — the flash.
 */
const LETTER_DELAY_MS = 850;

export function InvitationExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      setTimeout(() => setPhase("sealed"), reduced ? 0 : INTRO_MS),
    );
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  /** Let an impatient guest cut the initials short. */
  function skipIntro() {
    if (phase === "intro") setPhase("sealed");
  }

  function open() {
    if (phase !== "sealed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("opening");
    timers.current.push(
      setTimeout(() => setPhase("open"), reduced ? 200 : HANDOFF_MS),
    );
  }

  const showEnvelopeLayer = phase !== "open";
  const showLetter = phase === "opening" || phase === "open";

  return (
    <main className="stage-ground relative min-h-dvh overflow-hidden">
      <div className="leaf-shadow" aria-hidden="true" />

      {/* Always mounted, so leaves keep falling over the opened letter too. */}
      <AmbientPetals />

      {/* Envelope layer, absolutely placed so the letter can rise beneath it. */}
      {showEnvelopeLayer && (
        <div
          onClick={skipIntro}
          className={`absolute inset-0 z-20 flex min-h-dvh flex-col items-center justify-center px-6 transition-opacity duration-700 ${
            phase === "opening" ? "opacity-0 delay-700" : "opacity-100"
          }`}
        >
          {phase === "intro" ? (
            <MonogramDraw />
          ) : (
            <div className={phase === "sealed" ? "envelope-in" : undefined}>
              <Envelope phase={phase} onOpen={open} />
            </div>
          )}
        </div>
      )}

      {/* Rendered from "opening" onwards and never remounted, so its entrance
          animation runs once and is not restarted by the phase change. */}
      {showLetter && (
        <div className="relative z-10 flex min-h-dvh items-start justify-center px-4 py-10 sm:px-6 sm:py-16">
          <div
            className="letter-in w-full max-w-2xl"
            style={{ animationDelay: `${LETTER_DELAY_MS}ms` }}
          >
            <InvitationLetter />
          </div>
        </div>
      )}
    </main>
  );
}
