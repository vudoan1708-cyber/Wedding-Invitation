import type { Metadata } from "next";
import { InvitationExperience } from "@/components/InvitationExperience";

// The invitation is unlisted by design — it should not turn up in search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Home() {
  return <InvitationExperience />;
}
