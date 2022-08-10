/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  dark: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          light: "#f2f2e6",
          dark: "#07020a",
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
