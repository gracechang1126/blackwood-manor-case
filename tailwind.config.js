/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // desktops, or any phone/tablet held in landscape
        wide: { raw: '(min-width: 1024px), (orientation: landscape)' },
      },
      colors: {
        parchment: '#faf2e9',
        paper: '#efe2c8',
        ink: '#2b1d14',
        wood: '#1a110b',
        wine: { DEFAULT: '#6b1414', dark: '#2e0101', light: '#b4725f' },
        brass: '#c9a45c',
      },
      fontFamily: {
        display: ['Cinzel', 'Noto Serif TC', 'serif'],
        serif: ['"Cormorant Garamond"', '"Noto Serif TC"', 'serif'],
        tc: ['"Noto Serif TC"', '"PingFang TC"', 'serif'],
      },
    },
  },
  plugins: [],
}
