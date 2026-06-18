/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#d4e7ff',
          200: '#a9ceff',
          300: '#7da5ff',
          400: '#528cff',
          500: '#2773ff',
          600: '#0a1128',
          700: '#080e20',
          800: '#060a18',
          900: '#030610',
        },
        gold: {
          400: '#C5A028',
          500: '#F0B429',
        },
        dark: {
          bg: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        }
      },
      fontFamily: {
        'persian': ['Vazirmatn', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}