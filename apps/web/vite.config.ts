import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "styled-system": fileURLToPath(new URL("./styled-system", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": process.env.VITE_PROXY_TARGET ?? "http://localhost:3030",
    },
  },
})
