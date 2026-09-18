import { prisma } from "@/lib/prisma";
import { pollReddit, pollSoundCloud, pollYouTube } from "@/lib/discovery";
import { pollReleaseSources } from "@/lib/releases";
import { refreshSpotifyToken } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findFirst({ orderBy: { updatedAt: "desc" } });
  let official = 0;
  if (user) { let access = user.accessToken; if (user.tokenExpiresAt <= new Date(Date.now() + 60_000)) { const fresh = await refreshSpotifyToken(user.refreshToken); access = fresh.access_token; await prisma.user.update({ where: { id: user.id }, data: { accessToken: access, refreshToken: fresh.refresh_token ?? user.refreshToken, tokenExpiresAt: new Date(Date.now() + fresh.expires_in * 1000) } }); } official = (await pollReleaseSources(access)).official; }
  const [youtube, soundcloud, reddit] = await Promise.all([pollYouTube(), pollSoundCloud(), pollReddit()]);
  return NextResponse.json({ official, youtube, soundcloud, reddit, at: new Date().toISOString() });
}
