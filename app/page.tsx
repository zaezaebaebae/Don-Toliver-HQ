import BirthdayGate from "./BirthdayGate";
import LeakFeed from "./LeakFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Birthday Splash Gate */}
      <BirthdayGate />

      {/* Main Content Container */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 border-b border-zinc-800 pb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-red-600 sm:text-6xl">
            DON TOLIVER HQ
          </h1>
          <p className="mt-2 text-zinc-400">
            Unreleased Vault • Discography Tracker • Live Feed
          </p>
        </header>

        {/* Live Leak & Unreleased Feed Component */}
        <section className="mt-6">
          <LeakFeed />
        </section>
      </div>
    </main>
  );
}