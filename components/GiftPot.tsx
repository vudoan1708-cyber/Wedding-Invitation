import { coupleShort, wedding } from "@/lib/wedding";

/** An envelope with a heart — echoing the invitation's own envelope. */
function GiftMark() {
  return (
    <svg
      viewBox="0 0 72 56"
      aria-hidden="true"
      className="mx-auto h-auto w-16 text-gold"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="64" height="42" rx="2" strokeWidth="1.1" opacity="0.7" />
      <path d="M4 12 L36 34 L68 12" strokeWidth="0.9" opacity="0.5" />
      <path d="M4 50 L27 31 M68 50 L45 31" strokeWidth="0.7" opacity="0.35" />
      <path
        d="M36 26c-.2 0-.4-.1-.6-.2-2.7-2.1-5.9-4.7-5.9-8.1 0-2.1 1.7-3.8 3.7-3.8 1.1 0 2.1.5 2.8 1.3.7-.8 1.7-1.3 2.8-1.3 2 0 3.7 1.7 3.7 3.8 0 3.4-3.2 6-5.9 8.1-.2.1-.4.2-.6.2Z"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth="1"
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * Optional group gift. Deliberately placed after the RSVP and kept quiet:
 * etiquette is unanimous that a gift ask must never gate or precede the
 * invitation itself, and must read as easy to decline.
 */
export function GiftPot() {
  return (
    <section className="text-center">
      <GiftMark />

      <p className="mt-6 font-serif text-lg leading-relaxed text-ink sm:text-xl">
        Your presence on the day is the greatest gift of all.
      </p>
      <p className="mx-auto mt-3 max-w-md font-serif text-base leading-relaxed text-ink-soft">
        Should you wish to give something more, we are gathering a little towards
        our life together. There is no expectation whatsoever — and no amount is
        too small or too large.
      </p>

      <a
        href={wedding.gift.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex flex-col items-center border border-gold px-10 py-5 transition hover:bg-gold/10"
      >
        <span className="font-sans text-[0.7rem] tracking-[0.26em] text-ink uppercase">
          Contribute to our{" "}
          <span className="whitespace-nowrap">
            gift pot
            <svg
              width="10"
              height="10"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden="true"
              className="ml-2 inline-block align-baseline"
            >
              <path d="M5 2H2v10h10V9" />
              <path d="M8.5 1.5H12.5V5.5" />
              <path d="M12.5 1.5L6.5 7.5" />
            </svg>
          </span>
        </span>
        <span className="mt-2 font-serif text-sm text-ink-soft">
          {wedding.gift.host}
        </span>
      </a>

      <p className="mx-auto mt-6 max-w-md font-serif text-sm leading-relaxed text-ink-soft">
        {wedding.gift.service} is a secure group-gifting service. The link opens
        in a new tab, and {coupleShort} are the only people who see who has
        given — or whether you gave at all.
      </p>
    </section>
  );
}
