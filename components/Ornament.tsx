import { wedding } from "@/lib/wedding";

/**
 * A single corner flourish, drawn in the top-left orientation and mirrored into
 * the other three corners by the frame below.
 */
function CornerFlourish() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path
        d="M4 74 C4 40 22 12 62 6 C90 2 112 6 132 10"
        strokeWidth="1.1"
        opacity="0.75"
      />
      <path
        d="M10 74 C10 44 26 19 62 13 C88 9 108 13 126 17"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <path
        d="M18 66 C20 46 32 30 54 25 C66 22 74 25 78 31 C82 38 77 46 69 45 C62 44 60 37 65 34"
        strokeWidth="0.85"
        opacity="0.7"
      />
      <path
        d="M24 72 C30 56 40 46 54 44 C62 43 66 48 63 53 C60 58 53 56 54 51"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M14 88 C26 84 34 74 36 62 C37 55 34 51 29 52 C24 53 23 59 27 61"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M88 12 C96 20 106 23 116 21 C122 20 124 16 121 13 C118 10 113 12 114 16"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <circle cx="70" cy="30" r="1.6" opacity="0.5" strokeWidth="0.6" />
      <circle cx="45" cy="62" r="1.4" opacity="0.45" strokeWidth="0.6" />
      <circle cx="104" cy="17" r="1.3" opacity="0.45" strokeWidth="0.6" />
      <circle cx="20" cy="46" r="1.2" opacity="0.4" strokeWidth="0.6" />
    </g>
  );
}

/**
 * One corner, drawn at its natural aspect ratio. Positioning and mirroring are
 * handled by the caller so the flourish never stretches with the card.
 */
function Corner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 140 100"
      className={`absolute w-24 sm:w-36 ${className}`}
      aria-hidden="true"
    >
      <CornerFlourish />
    </svg>
  );
}

/**
 * The lace border. Rules are CSS boxes and the flourishes are fixed-size SVGs,
 * so a tall card gets a taller frame rather than a distorted one.
 */
export function OrnateFrame({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 text-gold ${className}`}
    >
      <div className="absolute inset-3 rounded-[3px] border border-gold/30 sm:inset-4" />
      <div className="absolute inset-[18px] rounded-xs border border-gold/15 sm:inset-6" />
      <Corner className="top-3 left-3 sm:top-4 sm:left-4" />
      <Corner className="top-3 right-3 -scale-x-100 sm:top-4 sm:right-4" />
      <Corner className="bottom-3 left-3 -scale-y-100 sm:bottom-4 sm:left-4" />
      <Corner className="right-3 bottom-3 -scale-100 sm:right-4 sm:bottom-4" />
    </div>
  );
}

/** Interlocked initials, as on the envelope flap. */
export function Monogram({
  className = "",
  size = 64,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`inline-flex items-baseline justify-center text-gold ${className}`}
      aria-label={`${wedding.groom.initial} and ${wedding.bride.initial}`}
    >
      <span
        className="emboss font-serif leading-none font-light"
        style={{ fontSize: size }}
      >
        {wedding.groom.initial}
      </span>
      <span
        className="emboss ml-[-0.18em] font-serif leading-none font-light"
        style={{ fontSize: size * 1.05, opacity: 0.85 }}
      >
        {wedding.bride.initial}
      </span>
    </span>
  );
}

/** Hairline rule with a diamond at its middle. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <span className="rule-gold h-px w-16 sm:w-24" />
      <svg width="9" height="9" viewBox="0 0 10 10" className="text-gold">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" opacity="0.55" />
      </svg>
      <span className="rule-gold h-px w-16 sm:w-24" />
    </div>
  );
}
