export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./popup.html"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0c",
        surface: "#1c1c1e",
        "surface-raised": "#2c2c2e",
        "surface-translucent": "rgba(28, 28, 30, 0.72)",
        hairline: "rgba(255, 255, 255, 0.08)",
        ink: "rgba(255, 255, 255, 0.92)",
        "ink-secondary": "rgba(255, 255, 255, 0.55)",
        "ink-tertiary": "rgba(255, 255, 255, 0.3)",
        accent: {
          DEFAULT: "#fa2d48",
          hover: "#ff445d",
        },
        danger: "#ff453a",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "Inter",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        s: "10px",
        m: "14px",
        l: "20px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0, 0, 0, 0.4)",
        dropdown: "0 12px 32px rgba(0, 0, 0, 0.5)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
}
