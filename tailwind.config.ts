import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#062B56",
        red: "#D71920",
        blue: "#0B5CAD",
        cream: "#F8F5EF",
        gray: "#EEF1F4",
        gold: "#C9A44C",
        ink: "#111111"
      },
      fontFamily: {
        display: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        brand: ["var(--font-cormorant)", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
