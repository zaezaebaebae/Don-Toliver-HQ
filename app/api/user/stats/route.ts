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
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const fetchTop = async (term: string) => {
      const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${term}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      return res.ok ? (await res.json()).items || [] : [];
    };

    const [shortTerm, mediumTerm, longTerm] = await Promise.all([
      fetchTop("short_term"),
      fetchTop("medium_term"),
      fetchTop("long_term"),
    ]);

    const allTracks = [...shortTerm, ...mediumTerm, ...longTerm];
    
    // Filter tracks featuring Don Toliver
    const donTracks = allTracks.filter((track: any) =>
      track.artists.some((artist: any) => artist.name.toLowerCase().includes("don toliver"))
    );

    // Calculate total duration in minutes of top Don Toliver tracks found
    const totalMs = donTracks.reduce((acc: number, track: any) => acc + track.duration_ms, 0);
    const estimatedMinutes = Math.round(totalMs / 60000);

    // Deduplicate top Don Toliver tracks for UI rendering
    const uniqueDonTracks = Array.from(new Map(donTracks.map((item: any) => [item.id, item])).values()).slice(0, 5);

    return NextResponse.json({
      authenticated: true,
      donCount: donTracks.length,
      estimatedMinutes,
      topDonTracks: uniqueDonTracks,
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
