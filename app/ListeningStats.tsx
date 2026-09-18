"use client";

import { useEffect, useState } from "react";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export default function ListeningStats() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [donCount, setDonCount] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`/api/user/stats?t=${Date.now()}`, { headers, cache: "no-store" });
        const data = await res.json();

        if (data.authenticated) {
          setAuthenticated(true);
          setMinutes(data.estimatedMinutes || 0);
          setDonCount(data.donCount || 0);
          setTracks(data.topDonTracks || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">Analyzing Don Toliver History...</div>;
  }

  if (!authenticated) {
    return (
      <div className="my-8 text-center">
        <span className="text-5xl font-black text-emerald-400">--</span>
        <p className="mt-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          Connect Spotify to view stats
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="my-6 text-center">
        <span className="text-5xl font-black text-emerald-400">{minutes}</span>
        <p className="mt-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          Vault Minutes (Top Rotation)
        </p>
      </div>

      <div className="space-y-3 border-t border-zinc-800/60 pt-4 text-xs">
        <div className="flex justify-between mb-4">
          <span className="text-zinc-500">Don Toliver Tracks Found</span>
          <span className="font-bold text-emerald-400">{donCount}</span>
        </div>

        <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Top Don Rotation</h3>
        {tracks.map((track, i) => (
          <div key={track.id} className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-2">
            <span className="text-xs font-bold text-emerald-400">#{i + 1}</span>
            {track.album?.images?.[0] && (
              <img src={track.album.images[0].url} alt={track.name} className="h-8 w-8 rounded object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{track.name}</p>
              <p className="truncate text-[10px] text-zinc-400">{track.artists.map((a) => a.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
