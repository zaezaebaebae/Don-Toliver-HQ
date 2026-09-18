import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("spotify_access_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ authenticated: false }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ authenticated: true, topTracks: data.items });
  } catch {
    return NextResponse.json({ authenticated: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
