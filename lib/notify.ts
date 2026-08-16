import { Resend } from "resend";
import { coupleShort, wedding } from "./wedding";
import type { Rsvp } from "./types";

/**
 * Resend's shared sender works without domain verification, but only delivers
 * to the address that owns the Resend account. Set RESEND_FROM to an address on
 * a verified domain to send anywhere.
 */
const DEFAULT_FROM = "onboarding@resend.dev";
const DEFAULT_TO = "vudoan1708@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(rsvp: Rsvp): string {
  const joining = rsvp.attendance === "joining";
  const name = escapeHtml(rsvp.name);

  const rows: [string, string][] = [
    ["Reply", joining ? "Joyfully accepts" : "Regretfully declines"],
    ...(joining
      ? ([["Guests", String(rsvp.guests)]] as [string, string][])
      : []),
    [
      "Received",
      new Date(rsvp.updatedAt).toLocaleString("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }),
    ],
  ];

  return `
  <div style="font-family:Georgia,'Times New Roman',serif;background:#f3ece2;padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#fbf8f3;border:1px solid #e7dccd;padding:32px;">
      <p style="margin:0 0 24px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8a7c6c;">
        ${escapeHtml(coupleShort)} &middot; ${wedding.date.monthLong} ${wedding.date.year}
      </p>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:normal;color:#4a4034;">${name}</h1>
      <p style="margin:0 0 24px;font-size:16px;color:${joining ? "#7a6640" : "#8a7c6c"};">
        ${joining ? "is coming to the wedding" : "cannot make it"}
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#4a4034;">
        ${rows
          .map(
            ([label, value]) => `
        <tr>
          <td style="padding:8px 0;border-top:1px solid #eee6da;color:#8a7c6c;width:35%;">${label}</td>
          <td style="padding:8px 0;border-top:1px solid #eee6da;">${escapeHtml(value)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      ${
        rsvp.message
          ? `<p style="margin:24px 0 0;padding-left:16px;border-left:2px solid #cdb894;font-style:italic;font-size:16px;line-height:1.6;color:#4a4034;">${escapeHtml(rsvp.message)}</p>`
          : ""
      }
      <p style="margin:32px 0 0;font-size:12px;color:#8a7c6c;">
        Every reply is listed on the host page.
      </p>
    </div>
  </div>`;
}

/**
 * Notifies the couple of a reply. Never throws: a failure here must not cost a
 * guest their RSVP, which is already safely stored by the time this runs.
 */
export async function notifyRsvp(rsvp: Rsvp): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("▸ RESEND_API_KEY not set — skipping RSVP notification");
    }
    return;
  }

  const joining = rsvp.attendance === "joining";
  const subject = joining
    ? `${rsvp.name} is joining${rsvp.guests > 1 ? ` (${rsvp.guests})` : ""}`
    : `${rsvp.name} cannot make it`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: `${coupleShort} Wedding <${process.env.RESEND_FROM || DEFAULT_FROM}>`,
      to: process.env.NOTIFY_EMAIL || DEFAULT_TO,
      subject: `RSVP · ${subject}`,
      html: buildHtml(rsvp),
    });
    if (error) console.error("RSVP notification failed:", error.message);
  } catch (error) {
    console.error("RSVP notification failed:", error);
  }
}
