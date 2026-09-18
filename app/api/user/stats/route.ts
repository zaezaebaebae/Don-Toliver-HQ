import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  let token = cookieStore.get("spotify_access_token")?.value;

  // Fallback to reading Bearer token from header if set by client
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
    // Try fetching medium_term (last 6 months) first, falling back to long_term
    let res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ authenticated: false, error: errorText }, { status: res.status });
    }

    let data = await res.json();

    // If medium_term is empty, fallback to long_term
    if (!data.items || data.items.length === 0) {
      res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        data = await res.json();
      }
    }

    return NextResponse.json({ authenticated: true, topTracks: data.items || [] });
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: "Server connection error" }, { status: 500 });
  }
}
