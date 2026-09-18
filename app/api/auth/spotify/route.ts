import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = "b57648db7e8b4023826da69b87e2c211";
  const redirectUri = "http://127.0.0.1:3000/api/auth/callback/spotify";
  const scope = "user-read-private user-read-email user-top-read user-read-recently-played";

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(spotifyAuthUrl, 307);
}