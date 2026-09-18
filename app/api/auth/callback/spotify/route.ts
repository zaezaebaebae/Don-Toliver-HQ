import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://don-toliver-hq.vercel.app";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}?error=spotify_denied`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${baseUrl}/api/auth/callback/spotify`;

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", data);
      return NextResponse.redirect(`${baseUrl}?error=token_exchange_failed`);
    }

    const cookieStore = await cookies();
    cookieStore.set("spotify_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.redirect(`${baseUrl}?spotify=connected`);
  } catch (err) {
    console.error("Spotify Auth Callback Error:", err);
    return NextResponse.redirect(`${baseUrl}?error=server_error`);
  }
}
