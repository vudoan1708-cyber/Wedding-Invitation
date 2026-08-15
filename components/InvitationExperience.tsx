"use client";

import { useEffect, useRef, useState } from "react";
import { Envelope } from "./Envelope";
import { InvitationLetter } from "./InvitationLetter";

type Phase = "sealed" | "opening" | "open";

export function InvitationExperience() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function open() {
    if (phase !== "sealed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("opening");
    timers.current.push(setTimeout(() => setPhase("open"), reduced ? 200 : 1650));
  }

  return (
    <main className="stage-ground relative min-h-dvh overflow-hidden">
      <div className="leaf-shadow" aria-hidden="true" />

      {phase !== "open" && (
        <div
          className={`relative flex min-h-dvh items-center justify-center px-6 py-16 transition-opacity duration-500 ${
            phase === "opening" ? "opacity-0 delay-1150" : "opacity-100"
          }`}
        >
          <Envelope phase={phase} onOpen={open} />
        </div>
      )}

      {phase === "open" && (
        <div className="relative flex min-h-dvh items-start justify-center px-4 py-10 sm:px-6 sm:py-16">
          <div className="letter-in w-full max-w-2xl">
            <InvitationLetter />
          </div>
        </div>
      )}
    </main>
  );
}
