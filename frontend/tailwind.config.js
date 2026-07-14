/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        border: "#334155",

        primary: "#22C55E",
        "primary-hover": "#16A34A",

        text: "#F8FAFC",
        muted: "#94A3B8",

        "board-light": "#F0D9B5",
        "board-dark": "#B58863",
      },
    },
  },
  plugins: [],
}

