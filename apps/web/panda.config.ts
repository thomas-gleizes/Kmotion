import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  preflight: true,

  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  conditions: {
    extend: {
      touch: "@media (hover: none)",
    },
  },

  theme: {
    extend: {
      tokens: {
        colors: {
          bg: { value: "#0a0a0c" },
          surface: { value: "#1c1c1e" },
          surfaceRaised: { value: "#2c2c2e" },
          surfaceTranslucent: { value: "rgba(28, 28, 30, 0.72)" },
          border: { value: "rgba(255, 255, 255, 0.08)" },
          text: { value: "rgba(255, 255, 255, 0.92)" },
          textSecondary: { value: "rgba(255, 255, 255, 0.55)" },
          textTertiary: { value: "rgba(255, 255, 255, 0.3)" },
          accent: { value: "#fa2d48" },
          accentHover: { value: "#ff445d" },
          danger: { value: "#ff453a" },
        },
        fonts: {
          sans: {
            value:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", Roboto, sans-serif',
          },
        },
        radii: {
          s: { value: "10px" },
          m: { value: "14px" },
          l: { value: "20px" },
          full: { value: "9999px" },
        },
        shadows: {
          card: { value: "0 8px 24px rgba(0, 0, 0, 0.4)" },
          bar: { value: "0 -8px 32px rgba(0, 0, 0, 0.35)" },
        },
        easings: {
          apple: { value: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
        },
        durations: {
          fast: { value: "150ms" },
          normal: { value: "250ms" },
        },
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },

  globalCss: {
    html: {
      colorScheme: "dark",
    },
    body: {
      backgroundColor: "bg",
      color: "text",
      fontFamily: "sans",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    "::-webkit-scrollbar": { width: "8px", height: "8px" },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: "9999px",
    },
    "::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  },

  outdir: "styled-system",
})
