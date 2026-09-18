"use client";

import { useEffect, useState } from "react";

export default function BirthdayGate({ children }: { children: React.ReactNode }) {
  const [showGate, setShowGate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = localStorage.getItem("has_seen_birthday_gate");
    if (!hasSeen) {
      setShowGate(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("has_seen_birthday_gate", "true");
    setShowGate(false);
  };

  if (!mounted) return null;

  if (showGate) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-6 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-wider text-red-500 md:text-6xl">
          HAPPY BIRTHDAY 🎂
        </h1>
        <p className="mt-4 max-w-md text-lg text-gray-300">
          Welcome to Don Toliver HQ. Your custom leak feed, discography tracker, and vault are ready.
        </p>
        <button
          onClick={handleEnter}
          className="mt-8 rounded-full bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700"
        >
          ENTER THE VAULT
        </button>
      </div>
    );
  }

  return <>{children}</>;
}