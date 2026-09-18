import { Suspense } from "react";
import HeaderAuth from "./HeaderAuth";
import LeakFeed from "./LeakFeed";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const isConnected = resolvedParams?.spotify === "connected";
  const liveMinutes = resolvedParams?.minutes as string | undefined;

  const displayMinutes = isConnected ? liveMinutes || "1,240" : "--";

  return (
    <main className="min-h-screen bg-black text-neutral-100 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-800/80 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono">
              HARDSTONE VAULT // DISCOGRAPHY RADAR
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight mt-1 text-white uppercase italic">
              DON TOLIVER <span className="text-emerald-500">HQ</span>
            </h1>
          </div>

          <Suspense
            fallback={
              <div className="px-5 py-2.5 rounded-full bg-emerald-500 text-black font-bold">
                CONNECT SPOTIFY
              </div>
            }
          >
            <HeaderAuth />
          </Suspense>
        </header>

        {/* Dashboard Content */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Card */}
          <div className="md:col-span-1 bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold tracking-wide text-neutral-200">
                LISTENING STATS
              </h2>
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"
                }`}
              />
            </div>

            <div className="py-6 border-y border-neutral-800/60 text-center">
              <span className="text-5xl font-black text-emerald-400 font-mono">
                {displayMinutes}
              </span>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-2">
                Total Minutes Streamed
              </p>
            </div>

            <div className="text-sm text-neutral-400 space-y-2">
              <div className="flex justify-between">
                <span>Fan Rank</span>
                <span className="text-amber-400 font-semibold">
                  {isConnected ? "Top 1% Global" : "Unranked"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Top Album</span>
                <span className="text-neutral-200">
                  {isConnected ? "HARDSTONE PSYCHO" : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Underground & Leak Feed Card */}
          <div className="md:col-span-2 bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold tracking-wide text-neutral-200">
                  UNDERGROUND & LEAK FEED
                </h2>
                <p className="text-xs text-neutral-400">
                  Real-time updates across TikTok, SoundCloud, YouTube & Reddit
                </p>
              </div>
              <span className="px-3 py-1 bg-neutral-800 text-emerald-400 border border-emerald-500/30 text-xs font-mono rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE POLLING
              </span>
            </div>

            {/* Client Component */}
            <LeakFeed />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-neutral-800/60 text-xs text-neutral-500 font-mono">
          DON TOLIVER FANVAULT // NON-OFFICIAL ARCHIVE
        </footer>
      </div>
    </main>
  );
}