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
        tremor: {
          brand: {
            green1: "#0b6623",
            green2: "#9dc183",
            green3: "#d1e4b1",
            black: "#38e348",
            gray: "#a0a8b2",
            white: "#f4f5f7",
          },
        },
        border: {
          DEFAULT: "#0b6623",
        },
      },
    },
  },
  plugins: [],
};
export default config;
