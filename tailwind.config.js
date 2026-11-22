/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"VT323"', 'monospace'],
        display: ['"Silkscreen"', '"Press Start 2P"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        dyslexic: ['"OpenDyslexic"', 'Comic Sans MS', 'sans-serif'],
      },
      colors: {
        retro: {
          bg: '#008080', // Classic Windows 98 Teal
          gray: '#c0c0c0',
          darkGray: '#808080',
          darkerGray: '#404040',
          lightGray: '#dfdfdf',
          white: '#ffffff',
          blue: '#000080',
          blueLight: '#1084d0',
          amber: '#f6ad55',
          neonCyan: '#00f3ff',
          neonPink: '#ff007f',
          lavender: '#9d8cd7',
          mint: '#76e2b4',
        }
      },
      boxShadow: {
        'retro-outset': 'inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'retro-inset': 'inset 1px 1px #0a0a0a, inset -1px -1px #fff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
        'retro-window': '2px 2px 0px rgba(0,0,0,0.35)',
        'retro-btn': 'inset -1px -1px #404040, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'retro-btn-pressed': 'inset 1px 1px #404040, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
      }
    },
  },
  plugins: [],
}
