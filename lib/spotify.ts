import { Track, UserListeningStats } from "@/lib/types";

export const DON_TOLIVER_ARTIST_ID = "4Gso3d4zSPftj9dYyYB722";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

type SpotifyTrack = { id: string; name: string; duration_ms: number; preview_url: string | null; artists: { id: string; name: string }[]; album: { name: string; images: { url: string }[] } };
type PlayedItem = { track: SpotifyTrack; played_at: string };

async function spotifyFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  if (!response.ok) throw new Error(`Spotify API ${response.status}: ${await response.text()}`);
  return response.json() as Promise<T>;
}

export async function refreshSpotifyToken(refreshToken: string) {
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(TOKEN_URL, { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }) });
  if (!response.ok) throw new Error("Could not refresh Spotify token");
  return response.json() as Promise<{ access_token: string; expires_in: number; refresh_token?: string }>;
}

export async function getDonToliverListeningStats(accessToken: string): Promise<UserListeningStats> {
  const recent = await spotifyFetch<{ items: PlayedItem[] }>("/me/player/recently-played?limit=50", accessToken);
  const matches = recent.items.filter(({ track }) => track.artists.some((artist) => artist.id === DON_TOLIVER_ARTIST_ID));
  const trackMap = new Map<string, Track & { plays: number; minutes: number }>();
  const albums = new Map<string, { minutes: number; plays: number; artworkUrl: string | null }>();

  for (const { track, played_at } of matches) {
    const minutes = track.duration_ms / 60000;
    const prior = trackMap.get(track.id);
    trackMap.set(track.id, { id: track.id, title: track.name, artist: track.artists.map((a) => a.name).join(", "), album: track.album.name, durationMs: track.duration_ms, artworkUrl: track.album.images[0]?.url ?? null, previewUrl: track.preview_url, playedAt: played_at, plays: (prior?.plays ?? 0) + 1, minutes: (prior?.minutes ?? 0) + minutes });
    const album = albums.get(track.album.name) ?? { minutes: 0, plays: 0, artworkUrl: track.album.images[0]?.url ?? null };
    album.minutes += minutes; album.plays += 1; albums.set(track.album.name, album);
  }
  return { totalMinutes: Math.round(matches.reduce((sum, item) => sum + item.track.duration_ms, 0) / 60000), uniqueTracks: trackMap.size, percentile: null, topTracks: [...trackMap.values()].sort((a, b) => b.plays - a.plays).slice(0, 5).map((item) => ({ ...item, minutes: Math.round(item.minutes) })), albumBreakdown: [...albums.entries()].map(([album, value]) => ({ album, ...value, minutes: Math.round(value.minutes) })).sort((a, b) => b.minutes - a.minutes), updatedAt: new Date().toISOString() };
}

export async function searchOfficialSpotifyReleases(accessToken: string) {
  return spotifyFetch<{ albums: { items: { id: string; name: string; artists: { name: string }[]; external_urls: { spotify: string }; images: { url: string }[]; release_date: string }[] } }>(`/artists/${DON_TOLIVER_ARTIST_ID}/albums?include_groups=album,single&market=US&limit=20`, accessToken);
}
