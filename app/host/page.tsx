import type { Metadata } from "next";
import { isHostAuthenticated } from "@/lib/auth";
import { listRsvps } from "@/lib/db";
import { usingLocalDatabase } from "@/lib/sql";
import { HostDashboard } from "@/components/HostDashboard";
import { HostLogin } from "@/components/HostLogin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Host · Replies",
  robots: { index: false, follow: false },
};

export default async function HostPage() {
  if (!(await isHostAuthenticated())) {
    return <HostLogin />;
  }

  const rsvps = await listRsvps();
  // Only ever true in local development, so nothing shows in production.
  return <HostDashboard rsvps={rsvps} localDatabase={usingLocalDatabase()} />;
}
