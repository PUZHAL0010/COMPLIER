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
          bg: '#0D0D0D',         // Deep matte black (Left sidebar & main bg)
          panel: '#181818',      // Panel containers
          editor: '#1E1E1E',     // Monaco editor dark background
          active: '#2A2A2A',     // Active tab/file highlight
          border: '#282828',     // Subtle dark border
          text: '#E1E1E1',       // Primary text
          muted: '#8E8E8E',      // Muted file names & labels
          blue: '#38BDF8',       // Accent sky blue
          green: '#4ADE80',      // Accent green
          red: '#F87171',        // Accent red
          yellow: '#FACC15',     // Accent yellow
          purple: '#C084FC',     // Accent purple
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
