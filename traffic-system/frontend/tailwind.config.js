/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0b',
          800: '#161618',
          700: '#232326',
        },
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        danger: "#ef4444",
      }
    },
  },
  plugins: [],
}
