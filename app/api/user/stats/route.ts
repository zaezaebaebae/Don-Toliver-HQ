import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_access_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, reason: "No access token cookie found" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Spotify API Error Response:", errBody);
      return NextResponse.json({ authenticated: false, error: errBody }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ authenticated: true, topTracks: data.items });
  } catch (err) {
    console.error("Failed fetching Spotify stats:", err);
    return NextResponse.json({ authenticated: false, error: "Server error" }, { status: 500 });
  }
}
