import { NotificationMode, Release, User } from "@prisma/client";
import { Resend } from "resend";

function wantsRelease(mode: NotificationMode, release: Release) {
  if (mode === "NONE") return false;
  if (mode === "ALL") return true;
  if (mode === "OFFICIAL_ONLY") return release.kind === "OFFICIAL";
  return release.kind === "LEAK" || release.kind === "SNIPPET" || release.kind === "PRERELEASE";
}

export async function notifyUsers(release: Release, users: User[]) {
  if (!process.env.RESEND_API_KEY || !process.env.ALERT_FROM_EMAIL) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.all(users.filter((user) => user.email && wantsRelease(user.notificationMode, release)).map((user) => resend.emails.send({ from: process.env.ALERT_FROM_EMAIL!, to: user.email!, subject: `New Don Toliver ${release.kind.toLowerCase()}: ${release.title}`, html: `<h1>${release.title}</h1><p>A Don Toliver ${release.kind.toLowerCase()} was just detected on ${release.source}.</p><p><a href="${release.sourceUrl}">Open release</a></p>` })));
}
