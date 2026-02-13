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
    },
  },
  plugins: [],
}