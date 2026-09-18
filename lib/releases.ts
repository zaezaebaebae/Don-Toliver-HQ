import { ReleaseKind, SourcePlatform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { searchOfficialSpotifyReleases } from "@/lib/spotify";
import { notifyUsers } from "@/lib/notifications";

const YOUTUBE_SEARCH = "https://www.youtube.com/results?search_query=";
const SOUNDCLOUD_SEARCH = "https://soundcloud.com/search/sounds?q=";

export async function pollReleaseSources(spotifyToken: string) {
  const albums = await searchOfficialSpotifyReleases(spotifyToken);
  const official = await Promise.all(albums.albums.items.map((album) => persistRelease({ externalId: `spotify:${album.id}`, title: album.name, artist: album.artists.map((a) => a.name).join(", "), kind: ReleaseKind.OFFICIAL, source: SourcePlatform.SPOTIFY, sourceUrl: album.external_urls.spotify, imageUrl: album.images[0]?.url, publishedAt: new Date(album.release_date) })));
  return { official: official.length, sourceQueries: { soundcloud: `${SOUNDCLOUD_SEARCH}${encodeURIComponent("Don Toliver")}`, youtube: `${YOUTUBE_SEARCH}${encodeURIComponent("Don Toliver unreleased")}` } };
}

export async function createCommunityDiscovery(input: { title: string; source: SourcePlatform; sourceUrl: string; kind: ReleaseKind; imageUrl?: string; previewUrl?: string }) {
  const externalId = `${input.source}:${Buffer.from(input.sourceUrl).toString("base64url")}`;
  return persistRelease({ ...input, externalId, artist: "Don Toliver" });
}

async function persistRelease(input: { externalId: string; title: string; artist: string; kind: ReleaseKind; source: SourcePlatform; sourceUrl: string; imageUrl?: string; previewUrl?: string; publishedAt?: Date }) {
  const existing = await prisma.release.findUnique({ where: { externalId: input.externalId } });
  const release = await prisma.release.upsert({ where: { externalId: input.externalId }, create: input, update: input });
  if (!existing) await notifyUsers(release, await prisma.user.findMany());
  return release;
}
