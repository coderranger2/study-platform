/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        editorial: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
        dyslexic: ['"OpenDyslexic"', 'Comic Sans MS', 'sans-serif'],
      },
      colors: {
        twilight: {
          950: '#090714',
          900: '#13112b',
          850: '#191535',
          800: '#201a42',
          700: '#2e245a',
          600: '#43367d',
        },
        plum: {
          950: '#150a1d',
          900: '#261334',
          800: '#3a1b4e',
          700: '#552472',
          500: '#9d4edd',
        },
        amberGold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f4b860',
          500: '#e59830',
          600: '#c2781b',
        },
        retro: {
          bg: '#008080',
          gray: '#c0c0c0',
          darkGray: '#808080',
          darkerGray: '#404040',
          lightGray: '#dfdfdf',
          white: '#ffffff',
          blue: '#000080',
          blueLight: '#1084d0',
        }
      },
      boxShadow: {
        'soft-glow': '0 0 35px -5px rgba(244, 184, 96, 0.25)',
        'cozy-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'retro-outset': 'inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'retro-inset': 'inset 1px 1px #0a0a0a, inset -1px -1px #fff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
        'retro-window': '2px 2px 0px rgba(0,0,0,0.35)',
        'retro-btn': 'inset -1px -1px #404040, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
      }
    },
  },
  plugins: [],
}
