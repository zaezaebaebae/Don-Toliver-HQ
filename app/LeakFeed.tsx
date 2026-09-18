"use client";

import { useEffect, useState } from "react";

interface LeakItem {
  id: string;
  title: string;
  sourcePlatform: "Reddit" | "YouTube" | "SoundCloud" | "TikTok";
  type: "Leak" | "Snippet" | "Unreleased";
  url: string;
  detectedAt: string;
}

export default function LeakFeed() {
  const [leaks, setLeaks] = useState<LeakItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaks = async () => {
    try {
      const res = await fetch("/api/leaks");
      const data = await res.json();
      if (data.success) {
        setLeaks(data.leaks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaks();
    const interval = setInterval(fetchLeaks, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center border border-dashed border-neutral-800 rounded-xl">
        <p className="text-neutral-400 text-sm animate-pulse">
          Scanning TikTok, SoundCloud, YouTube & Reddit networks...
        </p>
      </div>
    );
  }

  if (leaks.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-neutral-800 rounded-xl">
        <p className="text-neutral-400 text-sm">
          No new leaks or drops detected in the last 30 days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
      {leaks.map((leak) => (
        <a
          key={leak.id}
          href={leak.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-neutral-950/80 border border-neutral-800/60 rounded-xl flex justify-between items-center hover:border-emerald-500/40 transition-all group block"
        >
          <div className="pr-4 overflow-hidden">
            <h3 className="font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors truncate">
              {leak.title}
            </h3>
            <span className="text-xs text-neutral-400 uppercase font-mono">
              {leak.sourcePlatform} • {leak.type}
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono shrink-0 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            STREAM
          </span>
        </a>
      ))}
    </div>
  );
}