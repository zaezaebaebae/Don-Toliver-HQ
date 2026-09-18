"use client";
import { useState } from "react";
const options = ["ALL", "OFFICIAL_ONLY", "LEAKS_AND_SNIPPETS", "NONE"] as const;
export function NotificationSettings({ initialMode }: { initialMode: typeof options[number] }) {
  const [mode, setMode] = useState(initialMode); const [saved, setSaved] = useState(false);
  async function save(next: typeof mode) { setMode(next); setSaved(false); await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: next }) }); setSaved(true); }
  return <div className="flex flex-wrap items-center gap-2">{options.map((item) => <button key={item} onClick={() => save(item)} className={`rounded-full border px-3 py-1.5 text-xs ${mode === item ? "border-lime bg-lime text-black" : "border-white/15 text-white/70"}`}>{item.replaceAll("_", " ")}</button>)}{saved && <span className="text-xs text-lime">Saved</span>}</div>;
}
