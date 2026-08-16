import { wedding } from "@/lib/wedding";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Monday-first grid for the month containing `iso`, padded to whole weeks. */
function buildMonth(iso: string) {
  const target = new Date(`${iso}T00:00:00`);
  const year = target.getFullYear();
  const month = target.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() is Sunday-first; shift so Monday is column 0.
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = Array(offset).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return { weeks, weddingDay: target.getDate() };
}

function Heart() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="absolute inset-[7%] text-gold"
    >
      <path
        d="M12 21.2c-.3 0-.6-.1-.8-.3C7.4 17.9 3 14.2 3 9.4 3 6.4 5.3 4 8.2 4c1.5 0 2.9.7 3.8 1.8C12.9 4.7 14.3 4 15.8 4 18.7 4 21 6.4 21 9.4c0 4.8-4.4 8.5-8.2 11.5-.2.2-.5.3-.8.3Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Decorative month view with the wedding day hearted. Hidden from assistive
 * tech — the full date is stated in prose directly beneath it.
 */
export function WeddingCalendar() {
  const { weeks, weddingDay } = buildMonth(wedding.date.iso);

  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-76">
      <p className="text-center font-sans text-[0.65rem] tracking-[0.3em] text-ink-soft uppercase">
        {wedding.date.monthLong} {wedding.date.year}
      </p>

      <div className="mt-5 grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((initial, index) => (
          <span
            key={index}
            className="pb-2 text-center font-sans text-[0.6rem] tracking-[0.14em] text-gold/80 uppercase"
          >
            {initial}
          </span>
        ))}

        {weeks.flat().map((day, index) => {
          if (day === null) return <span key={index} />;
          const isWeddingDay = day === weddingDay;

          return (
            <span
              key={index}
              className="relative flex aspect-square items-center justify-center"
            >
              {isWeddingDay && <Heart />}
              <span
                className={
                  isWeddingDay
                    ? "relative font-serif text-base font-medium text-ink"
                    : "font-serif text-base text-ink-soft"
                }
              >
                {day}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
