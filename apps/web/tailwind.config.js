/** @type {import("tailwindcss").Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        header: "0px",
        footer: "56px",
      },
      colors: {
        primary: {
          light: "#ef4444",
          DEFAULT: "#dc2626",
          dark: "#991b1b",
        },
        secondary: {
          light: "#1C1C1C",
          DEFAULT: "#131313",
          dark: "#0d0d0d",
        },
      },
      animation: {
        "spin-background": "spin 60s linear infinite",
        "ping-border": "ping 500ms cubic-bezier(0.4, 0.4, 0.4, 1) 1",
        "text-scroll": "backAndForth 5s linear infinite;",
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
        100: "100",
      },
    },
  },
  plugins: [require("daisyui")],
}
