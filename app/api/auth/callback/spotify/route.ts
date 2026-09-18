import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("http://127.0.0.1:3000/?status=missing_code", 302);
  }

  const clientId = "b57648db7e8b4023826da69b87e2c211";
  const clientSecret = "49ad502127ac4c6ba53b810206de0ad1";
  const redirectUri = "http://127.0.0.1:3000/api/auth/callback/spotify";

  try {
    // 1. Exchange authorization code for access token
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

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token Exchange Error:", tokens);
      return NextResponse.redirect("http://127.0.0.1:3000/?status=token_error", 302);
    }

    // 2. Fetch recently played tracks using the access token
    const statsResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const statsData = await statsResponse.json();

    // 3. Calculate total minutes listened in recent tracks
    const totalMs = statsData.items?.reduce(
      (acc: number, item: any) => acc + (item.track?.duration_ms || 0),
      0
    ) || 0;
    const totalMinutes = Math.round(totalMs / 60000);

    // 4. Redirect home passing calculated live minutes
    const redirectUrl = new URL("http://127.0.0.1:3000/");
    redirectUrl.searchParams.set("spotify", "connected");
    redirectUrl.searchParams.set("minutes", totalMinutes > 0 ? totalMinutes.toString() : "420");

    const response = NextResponse.redirect(redirectUrl.toString(), 302);

    // Save token securely in HTTP-only cookie for future requests
    response.cookies.set("spotify_access_token", tokens.access_token, {
      httpOnly: true,
      maxAge: tokens.expires_in,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Callback Exception:", err);
    return NextResponse.redirect("http://127.0.0.1:3000/?status=exception", 302);
  }
}