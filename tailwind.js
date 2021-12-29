module.exports = {
  purge: ["**/*.vue", "**/*-settings.js"],
  content: [],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['Oxygen', 'sans-serif'],
      serif: ['Oxygen', 'serif'],
    },
    extend: {
      colors: {
        gray: {
          950: "#080c14"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
