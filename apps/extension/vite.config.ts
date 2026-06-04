import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    rollupOptions: {
      input: {
        popup: "src/popup.html",
        background: "src/background.ts",
        content: "src/content.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
})
