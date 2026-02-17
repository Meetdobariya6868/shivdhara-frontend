/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#daf1e4',
          200: '#b8e3cd',
          300: '#8dcfae',
          400: '#5fb48a',
          500: '#3f9970',
          600: '#2d7a58',
          700: '#246249',
          800: '#1f4e3b',
          900: '#1a4132',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
}