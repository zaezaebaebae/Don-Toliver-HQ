import BirthdayGate from "./BirthdayGate";
import LeakFeed from "./LeakFeed";
import ListeningStats from "./ListeningStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BirthdayGate />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Hardstone Vault // Discography Radar
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              DON TOLIVER HQ
            </h1>
          </div>

          <a
            href="/api/auth/login"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            CONNECT SPOTIFY
          </a>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: User Listening Stats */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Listening Stats
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* ListeningStats client component added here */}
            <ListeningStats />
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