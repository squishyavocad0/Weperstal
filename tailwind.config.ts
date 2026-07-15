import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F9F5EC",
          soft: "#FDFBF5",
          deep: "#F1EADB",
        },
        forest: {
          DEFAULT: "#56724F",
          deep: "#3E5439",
          mist: "#6E8A66",
        },
        sage: {
          DEFAULT: "#AFC8A3",
          light: "#D3E1CB",
          whisper: "#E9F0E4",
        },
        bark: {
          DEFAULT: "#9B7B5D",
          deep: "#7A5F46",
        },
        gold: {
          DEFAULT: "#D6B76A",
          soft: "#EBD9A8",
        },
        ink: "#2E3529",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        organic: "2rem",
        blob: "58% 42% 55% 45% / 48% 55% 45% 52%",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(62, 84, 57, 0.18)",
        lifted: "0 24px 60px -24px rgba(62, 84, 57, 0.28)",
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-90vh) translateX(6vw)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "leaf-fall": {
          "0%": { transform: "translateY(-10%) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "100%": { transform: "translateY(110vh) rotate(320deg)", opacity: "0" },
        },
      },
      animation: {
        sway: "sway 4.5s ease-in-out infinite",
        drift: "drift 14s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "leaf-fall": "leaf-fall 16s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
