"use client";

import { Monogram } from "./Ornament";

type Props = {
  phase: "sealed" | "opening" | "open";
  onOpen: () => void;
};

/**
 * The closed envelope. Clicking it lifts the flap, slides the card out, then the
 * parent swaps in the full invitation.
 */
export function Envelope({ phase, onOpen }: Props) {
  const opening = phase !== "sealed";

  return (
    <div className="flex flex-col items-center">
      <p
        className={`font-script text-4xl text-gold transition-all duration-700 sm:text-5xl ${
          opening ? "-translate-y-2 opacity-0" : "opacity-100"
        }`}
      >
        You&rsquo;re invited
      </p>

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label="Open the invitation"
        className="group mt-10 block [perspective:1400px] focus:outline-none"
      >
        <div className="relative aspect-[1.5] w-[min(86vw,430px)] [transform-style:preserve-3d]">
          {/* Envelope interior — visible once the flap lifts. */}
          <div className="absolute inset-0 rounded-[3px] bg-linen-deep shadow-[0_26px_60px_-30px_rgba(93,79,60,0.6)]" />

          {/* The letter, fully inside the envelope until it slides up and out. */}
          <div
            className={`paper-card absolute inset-x-[5%] top-[7%] bottom-[9%] z-10 rounded-xs transition-transform duration-1200 ease-[cubic-bezier(0.33,1,0.68,1)] ${
              opening ? "translate-y-[-86%]" : "translate-y-0"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <Monogram size={34} />
              <span className="rule-gold h-px w-16" />
            </div>
          </div>

          {/* Front face — a solid panel, so the letter is genuinely hidden. The
              folded side and bottom flaps are shading on top of it. */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-[3px] bg-linear-to-b from-paper to-paper-edge shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
            <svg
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <path d="M0 0 L150 96 L0 200 Z" fill="rgba(120,104,82,0.05)" />
              <path d="M300 0 L150 96 L300 200 Z" fill="rgba(120,104,82,0.05)" />
              <path d="M0 200 L150 96 L300 200 Z" fill="rgba(255,255,255,0.4)" />
              <g stroke="rgba(120,104,82,0.16)" strokeWidth="0.8" fill="none">
                <path d="M0 0 L150 96 L300 0" />
                <path d="M0 200 L150 96 L300 200" />
              </g>
            </svg>

            <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-3">
              <span className="rule-gold h-px w-20" />
              <span className="font-sans text-[0.6rem] tracking-[0.34em] text-ink-soft uppercase">
                {opening ? "Opening" : "Tap to open"}
              </span>
            </div>
          </div>

          {/* Flap. */}
          <div
            className="absolute inset-x-0 top-0 h-[58%] origin-top bg-linear-to-b from-paper to-paper-edge transition-transform duration-900 ease-[cubic-bezier(0.65,0,0.35,1)] backface-visible"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transform: opening ? "rotateX(-172deg)" : "rotateX(0deg)",
              zIndex: phase === "sealed" ? 40 : 10,
            }}
          >
            <div className="flex h-full items-start justify-center pt-[12%]">
              <Monogram size={40} />
            </div>
          </div>

          {/* Wax-style seal at the flap point. */}
          <div
            className={`absolute top-[58%] left-1/2 z-50 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 bg-gold/15 transition-all duration-500 ${
              opening ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <span className="flex h-full items-center justify-center">
              <Monogram size={16} />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
