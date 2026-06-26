import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#12324a",
          blue: "#1f7bbf",
          sky: "#e9f5fb",
          line: "#d9e5ec"
        }
      },
      boxShadow: {
        soft: "0 16px 45px rgba(18, 50, 74, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
