import { ReleaseKind, SourcePlatform } from "@prisma/client";
import { createCommunityDiscovery } from "@/lib/releases";

const cutoffDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45);
const classify = (title: string): ReleaseKind => /snippet/i.test(title) ? "SNIPPET" : /leak|unreleased/i.test(title) ? "LEAK" : "PRERELEASE";

export async function pollYouTube() {
  if (!process.env.YOUTUBE_API_KEY) return 0;
  const params = new URLSearchParams({ part: "snippet", q: "Don Toliver unreleased OR snippet OR leak", type: "video", order: "date", maxResults: "25", key: process.env.YOUTUBE_API_KEY });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`YouTube search failed: ${response.status}`);
  const payload = await response.json() as { items: { id: { videoId: string }; snippet: { title: string; publishedAt: string; thumbnails: { high?: { url: string } } } }[] };
  const items = payload.items.filter((item) => new Date(item.snippet.publishedAt) >= cutoffDate && /don toliver/i.test(item.snippet.title));
  await Promise.all(items.map((item) => createCommunityDiscovery({ title: item.snippet.title, kind: classify(item.snippet.title), source: SourcePlatform.YOUTUBE, sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`, imageUrl: item.snippet.thumbnails.high?.url })));
  return items.length;
}

export async function pollSoundCloud() {
  if (!process.env.SOUNDCLOUD_CLIENT_ID) return 0;
  const params = new URLSearchParams({ q: "Don Toliver", client_id: process.env.SOUNDCLOUD_CLIENT_ID, limit: "30", linked_partitioning: "false" });
  const response = await fetch(`https://api-v2.soundcloud.com/search/tracks?${params}`, { next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`SoundCloud search failed: ${response.status}`);
  const payload = await response.json() as { collection: { id: number; title: string; permalink_url: string; artwork_url: string | null; created_at: string }[] };
  const items = payload.collection.filter((item) => new Date(item.created_at) >= cutoffDate && /don toliver/i.test(item.title));
  await Promise.all(items.map((item) => createCommunityDiscovery({ title: item.title, kind: classify(item.title), source: SourcePlatform.SOUNDCLOUD, sourceUrl: item.permalink_url, imageUrl: item.artwork_url ?? undefined })));
  return items.length;
}

export async function pollReddit() {
  const response = await fetch("https://www.reddit.com/r/DonToliver/new.json?limit=50", { headers: { "User-Agent": "DonToliverHQ/1.0" }, next: { revalidate: 0 } });
  if (!response.ok) throw new Error(`Reddit feed failed: ${response.status}`);
  const payload = await response.json() as { data: { children: { data: { id: string; title: string; url: string; created_utc: number; thumbnail: string } }[] } };
  const items = payload.data.children.map((child) => child.data).filter((item) => new Date(item.created_utc * 1000) >= cutoffDate && /leak|snippet|unreleased|new track|release/i.test(item.title));
  await Promise.all(items.map((item) => createCommunityDiscovery({ title: item.title, kind: classify(item.title), source: SourcePlatform.REDDIT, sourceUrl: item.url.startsWith("http") ? item.url : `https://reddit.com${item.url}`, imageUrl: item.thumbnail.startsWith("http") ? item.thumbnail : undefined })));
  return items.length;
}
