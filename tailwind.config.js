/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './services/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E11",
        surface: "#16161A",
        primary: "#F9FAFB",
        secondary: "#9CA3AF",
        accent: "#E76F51",
        "accent-success": "#2A9D8F",
        border: "#ffffff1a",
        // Dark theme aliases for backward compatibility or explicit use
        "dark-bg": "#0E0E11",
        "dark-surface": "#16161A",
        "dark-border": "#ffffff1a",
        "dark-text": "#F9FAFB",
        "dark-text-secondary": "#9CA3AF",
      },
      fontFamily: {
        mono: ["PT Mono", "monospace"],
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
