import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          gold: "#F5A623",
          glow: "#FFD700",
        },
        dice: {
          cyan: "#00F0FF",
          blue: "#0066FF",
        },
        card: {
          dark: "#0A0E1A",
          surface: "#131832",
          border: "#1E2545",
        },
        accent: {
          green: "#00E676",
          red: "#FF3D71",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "dice-spin": "diceSpin 0.5s cubic-bezier(0.4,0,0.2,1)",
        "card-enter": "cardEnter 0.35s cubic-bezier(0.22,1,0.36,1)",
        "vault-pulse": "vaultPulse 2s ease-in-out infinite",
        "glow-ring": "glowRing 1.5s ease-in-out infinite alternate",
        "fade-up": "fadeUp 0.4s ease-out",
      },
      keyframes: {
        diceSpin: {
          "0%": { transform: "rotateX(0) rotateY(0) scale(0.5)", opacity: "0" },
          "50%": { transform: "rotateX(540deg) rotateY(360deg) scale(1.2)", opacity: "1" },
          "100%": { transform: "rotateX(720deg) rotateY(720deg) scale(1)", opacity: "1" },
        },
        cardEnter: {
          "0%": { transform: "scale(0.92) translateY(20px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        vaultPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(245,166,35,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(245,166,35,0.6)" },
        },
        glowRing: {
          "0%": { boxShadow: "0 0 5px rgba(0,240,255,0.3), inset 0 0 5px rgba(0,240,255,0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(0,240,255,0.6), inset 0 0 10px rgba(0,240,255,0.2)" },
        },
        fadeUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
