import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  preflight: true,

  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  conditions: {
    extend: {
      touch: "@media (hover: none)",
      light: '[data-theme="light"] &',
      spotify: '[data-theme="spotify"] &',
      ocean: '[data-theme="ocean"] &',
    },
  },

  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            value: {
              base: "#0a0a0c",
              _light: "#f5f5f7",
              _spotify: "#121212",
              _ocean: "#0f1620",
            },
          },
          surface: {
            value: {
              base: "#1c1c1e",
              _light: "#ffffff",
              _spotify: "#181818",
              _ocean: "#16212e",
            },
          },
          surfaceRaised: {
            value: {
              base: "#2c2c2e",
              _light: "#f0f0f2",
              _spotify: "#282828",
              _ocean: "#1e2c3c",
            },
          },
          surfaceTranslucent: {
            value: {
              base: "rgba(28, 28, 30, 0.72)",
              _light: "rgba(255, 255, 255, 0.78)",
              _spotify: "rgba(18, 18, 18, 0.78)",
              _ocean: "rgba(15, 22, 32, 0.78)",
            },
          },
          chromeTranslucent: {
            value: {
              base: "rgba(18, 18, 20, 0.85)",
              _light: "rgba(255, 255, 255, 0.85)",
              _spotify: "rgba(7, 7, 7, 0.85)",
              _ocean: "rgba(15, 20, 28, 0.85)",
            },
          },
          border: {
            value: {
              base: "rgba(255, 255, 255, 0.08)",
              _light: "rgba(0, 0, 0, 0.08)",
              _spotify: "rgba(255, 255, 255, 0.08)",
              _ocean: "rgba(255, 255, 255, 0.08)",
            },
          },
          text: {
            value: {
              base: "rgba(255, 255, 255, 0.92)",
              _light: "rgba(0, 0, 0, 0.88)",
              _spotify: "rgba(255, 255, 255, 0.92)",
              _ocean: "rgba(255, 255, 255, 0.92)",
            },
          },
          textSecondary: {
            value: {
              base: "rgba(255, 255, 255, 0.55)",
              _light: "rgba(0, 0, 0, 0.55)",
              _spotify: "rgba(255, 255, 255, 0.6)",
              _ocean: "rgba(255, 255, 255, 0.55)",
            },
          },
          textTertiary: {
            value: {
              base: "rgba(255, 255, 255, 0.3)",
              _light: "rgba(0, 0, 0, 0.32)",
              _spotify: "rgba(255, 255, 255, 0.35)",
              _ocean: "rgba(255, 255, 255, 0.3)",
            },
          },
          accent: {
            value: {
              base: "#fa2d48",
              _light: "#fa2d48",
              _spotify: "#1db954",
              _ocean: "#1d9bf0",
            },
          },
          accentHover: {
            value: {
              base: "#ff445d",
              _light: "#e0233c",
              _spotify: "#1ed760",
              _ocean: "#3db9ff",
            },
          },
          accentSoft: {
            value: {
              base: "rgba(250, 45, 72, 0.12)",
              _light: "rgba(250, 45, 72, 0.1)",
              _spotify: "rgba(29, 185, 84, 0.14)",
              _ocean: "rgba(29, 155, 240, 0.14)",
            },
          },
          accentGlow: {
            value: {
              base: "rgba(250, 45, 72, 0.22)",
              _light: "rgba(250, 45, 72, 0.18)",
              _spotify: "rgba(29, 185, 84, 0.25)",
              _ocean: "rgba(29, 155, 240, 0.25)",
            },
          },
          danger: {
            value: {
              base: "#ff453a",
              _light: "#d70015",
              _spotify: "#ff453a",
              _ocean: "#ff453a",
            },
          },
          dangerSoft: {
            value: {
              base: "rgba(255, 69, 58, 0.12)",
              _light: "rgba(215, 0, 21, 0.1)",
              _spotify: "rgba(255, 69, 58, 0.12)",
              _ocean: "rgba(255, 69, 58, 0.12)",
            },
          },
          success: {
            value: {
              base: "#30d158",
              _light: "#248a3d",
              _spotify: "#1db954",
              _ocean: "#30d158",
            },
          },
          overlay: {
            value: {
              base: "rgba(255, 255, 255, 0.05)",
              _light: "rgba(0, 0, 0, 0.04)",
              _spotify: "rgba(255, 255, 255, 0.05)",
              _ocean: "rgba(255, 255, 255, 0.05)",
            },
          },
          overlayStrong: {
            value: {
              base: "rgba(255, 255, 255, 0.08)",
              _light: "rgba(0, 0, 0, 0.06)",
              _spotify: "rgba(255, 255, 255, 0.08)",
              _ocean: "rgba(255, 255, 255, 0.08)",
            },
          },
          overlayIntense: {
            value: {
              base: "rgba(255, 255, 255, 0.14)",
              _light: "rgba(0, 0, 0, 0.1)",
              _spotify: "rgba(255, 255, 255, 0.14)",
              _ocean: "rgba(255, 255, 255, 0.14)",
            },
          },
        },
      },
      tokens: {
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
    '[data-theme="light"]': {
      colorScheme: "light",
    },
    body: {
      backgroundColor: "bg",
      color: "text",
      fontFamily: "sans",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      transition: "background-color token(durations.normal) token(easings.apple), color token(durations.normal) token(easings.apple)",
    },
    "::-webkit-scrollbar": { width: "8px", height: "8px" },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "overlayIntense",
      borderRadius: "9999px",
    },
    "::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  },

  outdir: "styled-system",
})
