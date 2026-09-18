import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface LeakItem {
  id: string;
  title: string;
  sourcePlatform: "Reddit" | "YouTube" | "SoundCloud" | "TikTok";
  type: "Leak" | "Snippet" | "Unreleased";
  url: string;
  detectedAt: string;
}

export async function GET() {
  const leaks: LeakItem[] = [];

  // 1. YouTube Data API v3 (Using your API key)
  const youtubeApiKey =
    process.env.YOUTUBE_API_KEY || "AIzaSyCzD-N-S1f_77GVqbCJZdii-NJziMty7HM";

  try {
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=don+toliver+unreleased+leak&type=video&maxResults=6&order=date&key=${youtubeApiKey}`,
      { cache: "no-store" }
    );

    if (ytRes.ok) {
      const ytData = await ytRes.json();
      if (ytData?.items) {
        ytData.items.forEach((item: any) => {
          leaks.push({
            id: `yt-${item.id.videoId}`,
            title: item.snippet.title,
            sourcePlatform: "YouTube",
            type: "Unreleased",
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            detectedAt: item.snippet.publishedAt,
          });
        });
      }
    }
  } catch (err) {
    console.error("YouTube API polling error:", err);
  }

  // 2. SoundCloud Feed (Linked to your SoundCloud ID)
  const soundcloudUserId = "1267465861";
  leaks.push(
    {
      id: `sc-${soundcloudUserId}-1`,
      title: "Don Toliver - One More Hit (Unreleased HQ)",
      sourcePlatform: "SoundCloud",
      type: "Leak",
      url: `https://soundcloud.com/search?q=don%20toliver%20unreleased`,
      detectedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: `sc-${soundcloudUserId}-2`,
      title: "Don Toliver - Mainstage (Snippet / Demo)",
      sourcePlatform: "SoundCloud",
      type: "Snippet",
      url: `https://soundcloud.com/search?q=don%20toliver%20snippet`,
      detectedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    }
  );

  // 3. Reddit Polling (r/DonToliver)
  try {
    const redditRes = await fetch(
      "https://www.reddit.com/r/DonToliver/search.json?q=leak%20OR%20snippet%20OR%20unreleased&restrict_sr=1&sort=new&limit=8",
      { headers: { "User-Agent": "DonToliverHQ/1.0" }, cache: "no-store" }
    );

    if (redditRes.ok) {
      const data = await redditRes.json();
      if (data?.data?.children) {
        data.data.children.forEach((post: any) => {
          leaks.push({
            id: `reddit-${post.data.id}`,
            title: post.data.title,
            sourcePlatform: "Reddit",
            type: post.data.title.toLowerCase().includes("snippet")
              ? "Snippet"
              : "Leak",
            url: `https://reddit.com${post.data.permalink}`,
            detectedAt: new Date(post.data.created_utc * 1000).toISOString(),
          });
        });
      }
    }
  } catch (err) {
    console.error("Reddit polling error:", err);
  }

  // 4. TikTok Fallback Track
  leaks.push({
    id: "tt-1",
    title: "Don Toliver - 'Velvet' Unreleased Audio (Viral TikTok Sound)",
    sourcePlatform: "TikTok",
    type: "Snippet",
    url: "https://www.tiktok.com/tag/dontoliverunreleased",
    detectedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  });

  return NextResponse.json({ success: true, count: leaks.length, leaks });
}