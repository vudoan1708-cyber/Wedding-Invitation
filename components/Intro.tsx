import { wedding } from "@/lib/wedding";

/**
 * The monogram drawn as outlines, so the initials appear to be written on.
 * A soft filled copy fades in behind once the stroke completes.
 */
export function MonogramDraw({ size = 96 }: { size?: number }) {
  const initials = `${wedding.groom.initial}${wedding.bride.initial}`;

  return (
    <div className="relative" style={{ width: size * 1.6, height: size * 1.25 }}>
      <svg
        viewBox="0 0 160 100"
        aria-hidden="true"
        className="intro-draw absolute inset-0 h-full w-full text-gold"
        style={{ ["--dash" as string]: "300" }}
      >
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="76"
          fontWeight="300"
          letterSpacing="-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
        >
          {initials}
        </text>
      </svg>

      <svg
        viewBox="0 0 160 100"
        aria-hidden="true"
        className="intro-glow absolute inset-0 h-full w-full text-gold"
      >
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="76"
          fontWeight="300"
          letterSpacing="-6"
          fill="currentColor"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}

/** Muted botanical tones that sit happily on ivory without shouting. */
const LEAF_COLOURS = [
  "#b3986a", // gold
  "#c08a7d", // dusty rose
  "#9aa88b", // sage
  "#c9a06a", // honey
  "#a8909e", // mauve
  "#8f9470", // olive
  "#cf9f86", // blush terracotta
  "#7f9384", // eucalyptus
];

/**
 * Deterministic scatter. Math.random() would produce different values on the
 * server and the client and trip a hydration mismatch, so positions come from
 * index arithmetic — the golden ratio spreads them without visible banding.
 */
const LEAVES = Array.from({ length: 26 }, (_, i) => ({
  left: `${(((i * 0.6180339887) % 1) * 100).toFixed(2)}%`,
  size: 8 + ((i * 5) % 10),
  dur: 13 + ((i * 7) % 14),
  delay: Number((((i * 2.7) % 17)).toFixed(2)),
  drift: (i % 2 ? 1 : -1) * (20 + ((i * 13) % 52)),
  spin: (i % 3 ? 1 : -1) * (220 + ((i * 37) % 220)),
  peak: (0.34 + ((i * 7) % 5) * 0.06).toFixed(2),
  colour: LEAF_COLOURS[i % LEAF_COLOURS.length],
  shape: i % 3,
}));

function LeafShape({ shape, size }: { shape: number; size: number }) {
  const common = {
    fill: "currentColor",
    fillOpacity: 0.5,
    stroke: "currentColor",
    strokeOpacity: 0.55,
    strokeWidth: 0.5,
  };

  if (shape === 0) {
    // Slim petal
    return (
      <svg width={size} height={size * 1.4} viewBox="0 0 10 14" fill="none">
        <path d="M5 0C7.6 3.2 9 6 9 8.4 9 11.5 7.2 14 5 14S1 11.5 1 8.4C1 6 2.4 3.2 5 0Z" {...common} />
      </svg>
    );
  }

  if (shape === 1) {
    // Pointed leaf with a midrib
    return (
      <svg width={size * 1.1} height={size * 1.5} viewBox="0 0 11 15" fill="none">
        <path d="M5.5 0C9 4 11 7.5 11 10c0 2.8-2.5 5-5.5 5S0 12.8 0 10C0 7.5 2 4 5.5 0Z" {...common} />
        <path d="M5.5 1.5V14" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.5" />
      </svg>
    );
  }

  // Small rounded leaf, tilted
  return (
    <svg width={size * 1.3} height={size} viewBox="0 0 13 10" fill="none">
      <path d="M0.5 9.5C0.5 4.5 4.5 0.5 12.5 0.5 12.5 5.5 8.5 9.5 0.5 9.5Z" {...common} />
      <path d="M1 9L12 1" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.5" />
    </svg>
  );
}

/**
 * Leaves and petals drifting down behind the stage. Purely atmospheric.
 *
 * Fixed rather than absolute: the opened letter scrolls, and the leaves should
 * keep falling across the viewport rather than only over the first screenful.
 */
export function AmbientPetals() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: leaf.left,
            color: leaf.colour,
            animationDuration: `${leaf.dur}s`,
            animationDelay: `${leaf.delay}s`,
            ["--drift" as string]: `${leaf.drift}px`,
            ["--spin" as string]: `${leaf.spin}deg`,
            ["--peak" as string]: leaf.peak,
          }}
        >
          <LeafShape shape={leaf.shape} size={leaf.size} />
        </span>
      ))}
    </div>
  );
}
