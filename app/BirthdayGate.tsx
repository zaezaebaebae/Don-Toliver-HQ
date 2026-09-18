"use client";

import { useEffect, useState } from "react";

export default function BirthdayGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showBirthday, setShowBirthday] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already opened the vault on this browser
    const hasSeenBirthday = localStorage.getItem("has_seen_birthday");

    if (!hasSeenBirthday) {
      setShowBirthday(true);
    } else {
      setShowBirthday(false);
    }
  }, []);

  const handleEnterVault = () => {
    // Set flag so subsequent visits bypass this screen
    localStorage.setItem("has_seen_birthday", "true");
    setShowBirthday(false);
  };

  // Prevent UI flash while checking localStorage
  if (showBirthday === null) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      {showBirthday ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute w-96 h-96 bg-emerald-600/30 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute w-96 h-96 bg-amber-500/20 rounded-full blur-[128px] pointer-events-none" />

          <div className="relative z-10 max-w-lg space-y-6 border border-emerald-500/30 bg-neutral-900/80 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <span className="text-xs font-mono text-emerald-400 tracking-[0.3em] uppercase">
              HARDSTONE VAULT // SPECIAL DELIVERY
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase italic">
              HAPPY BIRTHDAY MONKEY!! 🎉
            </h1>

            <div className="text-neutral-300 text-sm leading-relaxed space-y-3 text-left bg-black/40 p-4 rounded-xl border border-neutral-800/80">
              <p>
                I know this is coming to you very very late, trust me i feel horrible, but i learnt new things throughout this process of making this website.
              </p>
              <p>
                I hope you enjoy it and if anything i would like for us to make it even better together in some way shape or form.
              </p>
              <p className="text-emerald-400 font-semibold">
                I love you endlessly and remember this is one of 3 gifts from me to you.
              </p>
            </div>

            <button
              onClick={handleEnterVault}
              className="w-full py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold tracking-wider uppercase transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              OPEN YOUR VAULT 🔓
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}