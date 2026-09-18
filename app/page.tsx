import BirthdayGate from "./BirthdayGate";
import LeakFeed from "./LeakFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Birthday Splash Gate */}
      <BirthdayGate />

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        
        {/* Navigation / Header Bar */}
        <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-wider text-red-600 sm:text-5xl">
              DON TOLIVER HQ
            </h1>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              Unreleased Vault • Discography Tracker • Live Feed
            </p>
          </div>

          {/* Spotify Auth Link Button */}
          <a
            href="/api/auth/login"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          >
            CONNECT SPOTIFY
          </a>
        </header>

        {/* Live Leak & Unreleased Feed Component */}
        <section className="mt-6">
          <LeakFeed />
        </section>
      </div>
    </main>
  );
}