"use client";

import { useEffect, useState } from "react";

export default function BirthdayGate() {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("has_seen_birthday_gate");
    if (!hasSeen) {
      setShowGate(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("has_seen_birthday_gate", "true");
    setShowGate(false);
  };

  if (!showGate) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black p-6 text-center text-white">
      <h1 className="text-4xl font-black tracking-wider text-red-600 md:text-6xl">
        HAPPY BIRTHDAY 🎂
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-300">
        Welcome to Don Toliver HQ. Your custom leak feed, discography tracker, and vault are unlocked.
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