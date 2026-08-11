/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#0B0D12',
          panel: '#12151E',
          active: '#1A1D27',
          border: '#2A2D35',
          text: '#E6E9EF',
          muted: '#8E95A5',
          blue: '#4F8CFF',
          blueHover: '#3b78eb',
          green: '#3FB950',
          greenHover: '#2ea043',
          red: '#F85149',
          yellow: '#D29922',
          purple: '#A371F7',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
