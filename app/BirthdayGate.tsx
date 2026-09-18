"use client";

import { useEffect, useState } from "react";

export default function BirthdayGate() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenGate = localStorage.getItem("has_seen_birthday_gate");
    if (!hasSeenGate) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("has_seen_birthday_gate", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl">
        <h2 className="text-3xl font-black text-emerald-400 mb-4">HAPPY BIRTHDAY! ??</h2>
        <p className="text-sm leading-relaxed text-zinc-300">
          Happy Birthday Monkey!! I know this is coming to you very very late, trust me i feel horrible, but i learnt new things throughout this process of making this website. I hope you enjoy it and if anything i would like for us to make it even better together in some way shape or form. I love you endlessly and remember this is one of 3 gifts from me to you.
        </p>
        <button
          onClick={handleClose}
          className="mt-6 w-full rounded-full bg-emerald-500 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-emerald-400"
        >
          ENTER THE VAULT
        </button>
      </div>
    </div>
  );
}
