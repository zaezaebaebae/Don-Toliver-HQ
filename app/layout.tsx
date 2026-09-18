import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Don Toliver HQ", description: "Your Don Toliver listening universe." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
