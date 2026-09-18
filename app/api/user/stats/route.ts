import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  let token = cookieStore.get("spotify_access_token")?.value;

  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return NextResponse.json({ authenticated: false, reason: "No access token found" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ authenticated: false, error: errorText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ authenticated: true, topTracks: data.items || [] });
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: "Server connection error" }, { status: 500 });
  }
}
