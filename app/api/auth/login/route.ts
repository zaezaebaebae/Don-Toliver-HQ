import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://don-toliver-hq.vercel.app/api/auth/callback/spotify";

  if (!clientId) {
    return NextResponse.json({ error: "SPOTIFY_CLIENT_ID missing" }, { status: 500 });
  }

  const scope = "user-read-private user-read-email user-top-read user-read-recently-played";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    show_dialog: "true",
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
