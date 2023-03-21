/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ef4444",
          DEFAULT: "#dc2626",
          dark: "#991b1b",
        },
        secondary: {
          light: "#131313",
          DEFAULT: "#101010",
          dark: "#0d0d0d",
        },
      },
      zIndex: {
        "-10": "-10",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
      },
    },
  },
  plugins: [require("daisyui")],
}
