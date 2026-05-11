/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#121212',
        'game-card': '#1e1e1e',
        'game-gold': '#f3ba2f',
      }
    },
  },
  plugins: [],
}
