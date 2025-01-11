// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#121212', 
        darkText: '#e4e4e7', 
        darkCard: '#1e1e1e', 
      },
    },
  },
  plugins: [],
};
