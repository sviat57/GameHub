/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arcade: {
          black: '#070b0a',
          ink: '#020617',
          navy: '#050816',
          mint: '#5ed29c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      boxShadow: {
        neon: '0 0 32px rgba(94, 210, 156, 0.25)',
      },
    },
  },
  plugins: [],
}
