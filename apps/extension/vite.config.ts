import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { copyFileSync } from "node:fs"
import { resolve } from "node:path"

// Copies manifest.json into the build output so `dist/` is a complete,
// loadable/packageable extension (web-ext packages the dist/ folder).
function copyManifest(): Plugin {
  return {
    name: "copy-manifest",
    writeBundle(options) {
      const outDir = options.dir ?? resolve(__dirname, "dist")
      copyFileSync(resolve(__dirname, "manifest.json"), resolve(outDir, "manifest.json"))
    },
  }
}

export default defineConfig({
  plugins: [react(), copyManifest()],
  base: "./",
  build: {
    minify: "esbuild",
    rollupOptions: {
      input: {
        popup: "popup.html",
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
