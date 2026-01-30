/** @type {import('tailwindcss').Config} */
module.exports = {
  // Важно: IDE должна знать, в каких файлах искать классы
  content: [
    "./index.html",
    "./src/prototype/**/*.html",
    "./src/prototype/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        spaceNavy: '#1E1E2F',
        pythonGold: '#FFD43B',
        pythonBlue: '#306998',
        ivory: '#FAF9F6',
        ghostGray: 'rgba(255, 255, 255, 0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}