import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#070708", panel: "#121214", lime: "#d7ff4d" },
      boxShadow: { glow: "0 0 40px rgba(215,255,77,.14)" },
    },
  },
  plugins: [],
} satisfies Config;
