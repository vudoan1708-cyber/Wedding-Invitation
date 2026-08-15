"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Monogram } from "./Ornament";
import { coupleShort, wedding } from "@/lib/wedding";
import type { Rsvp } from "@/lib/types";

type Filter = "all" | "joining" | "not-joining";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HostDashboard({
  rsvps,
  localDatabase = false,
}: {
  rsvps: Rsvp[];
  localDatabase?: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const joining = rsvps.filter((r) => r.attendance === "joining");
    const declining = rsvps.filter((r) => r.attendance === "not-joining");
    return {
      replies: rsvps.length,
      parties: joining.length,
      heads: joining.reduce((sum, r) => sum + (r.guests || 1), 0),
      declining: declining.length,
    };
  }, [rsvps]);

  const visible = useMemo(
    () => (filter === "all" ? rsvps : rsvps.filter((r) => r.attendance === filter)),
    [rsvps, filter],
  );

  async function handleLogout() {
    await fetch("/api/host/logout", { method: "POST" });
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove the reply from ${name}? This cannot be undone.`)) return;
    setPendingId(id);
    const response = await fetch(`/api/host/rsvps/${id}`, { method: "DELETE" });
    setPendingId(null);
    if (response.ok) router.refresh();
  }

  function exportCsv() {
    const rows = [
      ["Name", "Attendance", "Guests", "Message", "Replied"],
      ...rsvps.map((r) => [
        r.name,
        r.attendance === "joining" ? "Joining" : "Not joining",
        String(r.guests),
        r.message,
        r.updatedAt,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-rsvps.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stage-ground min-h-dvh px-4 py-12 sm:px-8">
      {localDatabase && (
        <div className="mx-auto mb-8 max-w-5xl border border-dashed border-[#a4553f]/50 bg-[#a4553f]/5 px-5 py-3 text-center font-sans text-[0.65rem] tracking-[0.2em] text-[#a4553f] uppercase">
          Local database · these replies are not real
        </div>
      )}
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-gold/25 pb-8">
          <div>
            <Monogram size={34} />
            <h1 className="mt-4 font-serif text-3xl font-light text-ink">
              Replies for {coupleShort}
            </h1>
            <p className="mt-1 font-serif text-base text-ink-soft">
              {wedding.date.long} · {wedding.location.line}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={exportCsv}
              className="border border-gold/50 px-6 py-3 font-sans text-[0.65rem] tracking-[0.22em] text-ink uppercase transition hover:bg-gold hover:text-paper"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-gold/25 px-6 py-3 font-sans text-[0.65rem] tracking-[0.22em] text-ink-soft uppercase transition hover:border-gold/60 hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="Replies" value={stats.replies} />
          <Stat label="Joining" value={stats.parties} accent />
          <Stat label="Total attending" value={stats.heads} accent />
          <Stat label="Cannot make it" value={stats.declining} />
        </section>

        <div className="mt-10 flex flex-wrap gap-2">
          {(
            [
              ["all", `All (${stats.replies})`],
              ["joining", `Joining (${stats.parties})`],
              ["not-joining", `Cannot make it (${stats.declining})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`border px-5 py-2.5 font-sans text-[0.65rem] tracking-[0.18em] uppercase transition ${
                filter === value
                  ? "border-gold bg-gold/15 text-ink"
                  : "border-gold/25 text-ink-soft hover:border-gold/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="mt-8 space-y-3">
          {visible.length === 0 && (
            <p className="paper-card rounded-xs px-8 py-12 text-center font-serif text-lg text-ink-soft">
              No replies here yet.
            </p>
          )}

          {visible.map((rsvp) => (
            <article
              key={rsvp.id}
              className="paper-card flex flex-wrap items-start gap-4 rounded-xs px-6 py-5 sm:px-8"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-2xl font-light text-ink">
                    {rsvp.name}
                  </h2>
                  <span
                    className={`border px-3 py-1 font-sans text-[0.6rem] tracking-[0.18em] uppercase ${
                      rsvp.attendance === "joining"
                        ? "border-gold bg-gold/15 text-ink"
                        : "border-ink-soft/30 text-ink-soft"
                    }`}
                  >
                    {rsvp.attendance === "joining"
                      ? `Joining · ${rsvp.guests}`
                      : "Cannot make it"}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-3 border-l border-gold/40 pl-4 font-serif text-lg leading-relaxed text-ink italic">
                    {rsvp.message}
                  </p>
                )}
                <p className="mt-3 font-sans text-[0.65rem] tracking-[0.16em] text-ink-soft uppercase">
                  Replied {formatDate(rsvp.updatedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(rsvp.id, rsvp.name)}
                disabled={pendingId === rsvp.id}
                className="font-sans text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase underline decoration-transparent underline-offset-4 transition hover:text-[#a4553f] hover:decoration-current disabled:opacity-40"
              >
                {pendingId === rsvp.id ? "Removing" : "Remove"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="paper-card rounded-xs px-4 py-6 text-center sm:px-6 sm:py-7">
      <p
        className={`emboss font-serif text-4xl leading-none font-light sm:text-5xl ${
          accent ? "text-gold" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-3 font-sans text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase sm:text-[0.62rem] sm:tracking-[0.22em]">
        {label}
      </p>
    </div>
  );
}
