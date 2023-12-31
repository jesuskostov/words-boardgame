/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "red-light": "#FFECE9",
        "green-light": "#75EAAF",
        "custom-gray": "#252528",
        "black-custom": "#010010",
      },
    },
    fontFamily: {
      mont: ["Montserrat"],
    },
  },
  plugins: [],
};
