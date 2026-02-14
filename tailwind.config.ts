import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        success: "#95E616",
        background: "#F7F9FC",
        surface: "#FFFFFF",
      },
      boxShadow: {
        "pixel": "4px 4px 0 rgba(0, 0, 0, 0.2), 8px 8px 0 rgba(0, 0, 0, 0.1)",
        "pixel-sm": "2px 2px 0 rgba(0, 0, 0, 0.2), 4px 4px 0 rgba(0, 0, 0, 0.1)",
        "pixel-lg": "6px 6px 0 rgba(0, 0, 0, 0.2), 12px 12px 0 rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        "pixel": ["'Press Start 2P'", "cursive"],
        "pixel-body": ["'VT323'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
