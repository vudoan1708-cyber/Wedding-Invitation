import { wedding } from "@/lib/wedding";

/**
 * Line-art of a garden pavilion at dusk — string lights, planting, an arch.
 * Drawn rather than photographed so it matches the card and needs no external
 * image host.
 */
function GardenScene() {
  return (
    <svg
      viewBox="0 0 400 190"
      aria-hidden="true"
      className="h-auto w-full text-gold"
    >
      <defs>
        <linearGradient id="venue-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf8f3" />
          <stop offset="100%" stopColor="#f0e7d9" />
        </linearGradient>
      </defs>

      <rect width="400" height="190" fill="url(#venue-sky)" />

      {/* Distant planting */}
      <g fill="currentColor" opacity="0.1">
        <ellipse cx="40" cy="150" rx="46" ry="30" />
        <ellipse cx="352" cy="152" rx="52" ry="32" />
        <ellipse cx="120" cy="158" rx="34" ry="20" />
      </g>

      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {/* String lights */}
        <path d="M6 30 C90 62 150 62 200 48 C250 34 320 40 394 24" strokeWidth="0.8" opacity="0.55" />
        {[
          [40, 47], [72, 55], [104, 59], [136, 60], [168, 56],
          [200, 48], [232, 42], [264, 39], [296, 37], [328, 34], [360, 29],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + 9} strokeWidth="0.6" opacity="0.5" />
            <circle cx={x} cy={y + 12} r="2.6" fill="currentColor" fillOpacity="0.5" stroke="none" />
            <circle cx={x} cy={y + 12} r="5" fill="currentColor" fillOpacity="0.12" stroke="none" />
          </g>
        ))}

        {/* Arch */}
        <path d="M150 168 L150 108 A50 50 0 0 1 250 108 L250 168" strokeWidth="1.2" opacity="0.75" />
        <path d="M156 168 L156 110 A44 44 0 0 1 244 110 L244 168" strokeWidth="0.5" opacity="0.35" />
        {/* Foliage on the arch */}
        <path d="M152 150 C142 142 146 132 156 134 M248 150 C258 142 254 132 244 134" strokeWidth="0.8" opacity="0.6" />
        <path d="M160 96 C150 88 156 78 166 82 M240 96 C250 88 244 78 234 82" strokeWidth="0.8" opacity="0.6" />
        <path d="M186 70 C182 60 192 54 199 60 C206 54 216 60 212 70" strokeWidth="0.9" opacity="0.65" />
        <circle cx="199" cy="66" r="2" fill="currentColor" fillOpacity="0.4" stroke="none" />

        {/* Ground */}
        <path d="M0 168 L400 168" strokeWidth="0.8" opacity="0.4" />

        {/* Planters */}
        <path d="M112 168 L116 152 L136 152 L140 168 Z" strokeWidth="0.8" opacity="0.55" />
        <path d="M126 152 C120 142 124 132 132 134 M126 152 C132 142 128 132 120 134" strokeWidth="0.7" opacity="0.5" />
        <path d="M260 168 L264 152 L284 152 L288 168 Z" strokeWidth="0.8" opacity="0.55" />
        <path d="M274 152 C268 142 272 132 280 134 M274 152 C280 142 276 132 268 134" strokeWidth="0.7" opacity="0.5" />

        {/* Seating suggestion */}
        <path d="M176 168 L176 156 M224 168 L224 156 M172 156 L228 156" strokeWidth="0.7" opacity="0.45" />
      </g>
    </svg>
  );
}

export function VenueCard() {
  const { venue } = wedding;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-xs border border-gold/30">
        <GardenScene />
      </div>

      <p className="emboss mt-6 text-center font-serif text-3xl leading-snug font-light text-ink">
        {venue.name}
      </p>
      <p className="mt-2 text-center font-serif text-base text-ink-soft italic">
        {venue.tagline}
      </p>

      <p className="mt-4 text-center font-serif text-lg text-ink">
        {venue.street}
        <br />
        {venue.district}, {wedding.location.city}
      </p>
      <p className="mt-3 text-center font-sans text-[0.65rem] tracking-[0.22em] text-ink-soft uppercase">
        {venue.time}
      </p>

      <div className="mt-6 text-center">
        <a
          href={venue.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-b border-gold/50 pb-1 font-sans text-[0.65rem] tracking-[0.2em] text-ink uppercase transition hover:border-gold hover:text-gold"
        >
          See the venue
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 2H2v10h10V9" />
            <path d="M8.5 1.5H12.5V5.5" />
            <path d="M12.5 1.5L6.5 7.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
