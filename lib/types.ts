export type ReleaseKind = "OFFICIAL" | "LEAK" | "SNIPPET" | "PRERELEASE";
export type SourcePlatform = "SPOTIFY" | "APPLE_MUSIC" | "SOUNDCLOUD" | "YOUTUBE" | "REDDIT";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  durationMs: number;
  artworkUrl: string | null;
  previewUrl: string | null;
  playedAt?: string;
}

export interface AlbumStreams { album: string; minutes: number; plays: number; artworkUrl: string | null; }
export interface TopTrack extends Track { plays: number; minutes: number; }

export interface UserListeningStats {
  totalMinutes: number;
  uniqueTracks: number;
  percentile: number | null;
  topTracks: TopTrack[];
  albumBreakdown: AlbumStreams[];
  updatedAt: string;
}

export interface ReleaseFeedItem {
  id: string;
  title: string;
  artist: string;
  kind: ReleaseKind;
  source: SourcePlatform;
  sourceUrl: string;
  imageUrl: string | null;
  previewUrl: string | null;
  publishedAt: string | null;
  detectedAt: string;
}
