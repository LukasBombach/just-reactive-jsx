/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/pages/**/*.{ts,tsx,css}", "src/server/**/*.{ts,tsx,css}"],
  theme: {
    colors: {
      black: "#1F2D3D",
      white: "#FFFFFF",
      snow: "#F9FAFC",
      slate: "#3C4858",
      steel: "#273444",
      midnight: "#282C34",
      moon: "#DCDCDC",
    },
    extend: {
      fontFamily: {
        serif: "serif",
      },
    },
  },
  plugins: [],
};
