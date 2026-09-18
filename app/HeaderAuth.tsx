"use client";

import { useSearchParams } from "next/navigation";

export default function HeaderAuth() {
  const searchParams = useSearchParams();
  const isConnected = searchParams.get("spotify") === "connected";

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 px-5 py-2.5 rounded-full">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-bold text-emerald-400 font-mono tracking-wide">
          SPOTIFY CONNECTED
        </span>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/spotify"
      rel="noreferrer"
      className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all duration-200 inline-block text-center cursor-pointer shadow-lg shadow-emerald-500/20"
    >
      CONNECT SPOTIFY
    </a>
  );
}
