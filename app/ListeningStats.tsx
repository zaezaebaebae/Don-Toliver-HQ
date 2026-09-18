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
  const [tracks, setTracks] = useState<Track[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch("/api/user/stats", {
          headers,
          cache: "no-store",
        });

        const data = await res.json();

        if (data.authenticated) {
          setAuthenticated(true);
          setTracks(data.topTracks || []);
        } else {
          setAuthenticated(false);
          if (data.reason || data.error) {
            setErrorMsg(data.reason || "Authentication required");
          }
        }
      } catch (e) {
        console.error(e);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-zinc-500 animate-pulse">
        Syncing Spotify Stats...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="my-8 text-center">
        <span className="text-4xl font-black text-emerald-500/50">--</span>
        <p className="mt-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          Connect Spotify above to load your top streams
        </p>
        {errorMsg && <p className="mt-1 text-[10px] text-zinc-600">{errorMsg}</p>}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="my-8 text-center text-xs text-zinc-400">
        Connected! Listening history is still warming up for this account.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Top Streams</h3>
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
  );
}
