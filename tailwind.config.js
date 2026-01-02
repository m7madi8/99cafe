/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./us/**/*.{html,js}",
    "./index.html",
    "./main.html",
    "./ps/**/*.{html,js}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem'
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'cafe-red': '#D90429',
        'cafe-red-light': '#EF233C',
        'cafe-black': '#222',
        'cafe-black-dark': '#000',
        'cafe-white': '#fff',
        'cafe-gray': '#f8f8f8',
      }
    }
  },
  plugins: [],
}


