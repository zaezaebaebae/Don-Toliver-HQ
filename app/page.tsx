import BirthdayGate from "./BirthdayGate";
import LeakFeed from "./LeakFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Birthday Splash Gate */}
      <BirthdayGate />

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* Navigation / Header Bar */}
        <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Hardstone Vault // Discography Radar
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              DON TOLIVER HQ
            </h1>
          </div>

          {/* Spotify Auth Button */}
          <a
            href="/api/auth/login"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            CONNECT SPOTIFY
          </a>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column: User Listening Stats */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Listening Stats
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="my-10 text-center">
              <span className="text-5xl font-black text-emerald-400">--</span>
              <p className="mt-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Total Minutes Streamed
              </p>
            </div>

            <div className="space-y-3 border-t border-zinc-800/60 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Fan Rank</span>
                <span className="font-bold text-zinc-300">Unranked</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Top Album</span>
                <span className="font-bold text-zinc-300">N/A</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Feed */}
          <div className="lg:col-span-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur">
              <LeakFeed />
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}