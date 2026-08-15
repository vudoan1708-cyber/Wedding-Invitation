"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Divider, Monogram } from "./Ornament";

export function HostLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "Incorrect password.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setBusy(false);
    }
  }

  return (
    <div className="stage-ground flex min-h-dvh items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="paper-card w-full max-w-sm rounded-xs px-10 py-14 text-center"
      >
        <Monogram size={44} />
        <Divider className="my-8" />
        <p className="font-sans text-[0.65rem] tracking-[0.3em] text-ink-soft uppercase">
          Host access
        </p>
        <p className="mt-4 font-serif text-lg text-ink">
          Enter the host password to see who has replied.
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          className="mt-8 w-full border-b border-gold/40 bg-transparent pb-2 text-center font-serif text-xl text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none"
        />

        {error && (
          <p role="alert" className="mt-6 font-serif text-base text-[#a4553f]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-10 w-full border border-gold py-4 font-sans text-[0.7rem] tracking-[0.28em] text-ink uppercase transition hover:bg-gold hover:text-paper disabled:opacity-50"
        >
          {busy ? "Checking" : "Enter"}
        </button>
      </form>
    </div>
  );
}
