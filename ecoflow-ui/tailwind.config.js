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
        terracotta: {
          50: '#fbf4f2',
          100: '#f7e7e2',
          200: '#eed2c7',
          300: '#e1b3a3',
          400: '#d18b76',
          500: '#E07A5F', // Primary Accent
          600: '#cc6145',
          700: '#aa4d35',
          800: '#8a402d',
          900: '#723829',
        },
        amber: {
          50: '#fefcf3',
          100: '#fcf6e0',
          200: '#f9eac2',
          300: '#f6dc9d',
          400: '#F2CC8F', // Secondary Accent (Sunset Amber)
          500: '#e8b868',
          600: '#cb9648',
          700: '#a37135',
          800: '#83592e',
          900: '#6d4928',
        },
        cream: {
          50: '#fbfaf4',
          100: '#F4F1DE', // Soft Cream
          200: '#eae5c5',
          300: '#ddd4a5',
        },
        sage: {
          50: '#f4f8f6',
          100: '#e3efe9',
          200: '#c8dfd5',
          300: '#a3c9bb',
          400: '#81B29A', // Eco Green
          500: '#5e967e',
          600: '#467864',
          700: '#3a6152',
        },
        charcoal: {
          800: '#282524',
          900: '#1C1917', // Warm Deep Espresso Charcoal
          950: '#12100E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-terracotta': '0 0 25px -5px rgba(224, 122, 95, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(242, 204, 143, 0.4)',
        'glow-sage': '0 0 25px -5px rgba(129, 178, 154, 0.35)',
      }
    },
  },
  plugins: [],
}
