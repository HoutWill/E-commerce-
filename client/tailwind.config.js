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
        pink: {
          50: '#fff1f4',
          100: '#ffe4e9',
          200: '#fecdd7',
          300: '#fda4b9',
          400: '#fb7193',
          500: '#f43f6f',
          600: '#e11d59',
          700: '#be1247',
          800: '#9f1240',
          900: '#84143a',
          950: '#4c051c',
        },
        luxury: {
          dark: '#0f0c13',
          card: '#181420',
          border: '#2a2238',
          accent: '#ff4d8d',
          gold: '#fcd34d'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 77, 141, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 77, 141, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
