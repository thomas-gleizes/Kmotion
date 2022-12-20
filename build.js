import { exec } from "node:child_process"
import { build } from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"
import postCssPlugin from "esbuild-style-plugin"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

const [, , dev] = process.argv

await build({
  entryPoints: ["src/app.ts"],
  target: "node18",
  format: "esm",
  platform: "node",
  outdir: "dist",
  watch: dev === "--dev",
  logLevel: "debug",
  loader: {
    ".css": "file"
  },
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  tsconfig: "tsconfig.json"
})

await build({
  entryPoints: ["src/client/main.tsx", "src/client/styles.css"],
  target: "chrome96",
  watch: dev === "--dev",
  logLevel: "debug",
  platform: "browser",
  bundle: true,
  outdir: "dist/static",
  plugins: [
    postCssPlugin({
      postcss: {
        plugins: [tailwind, autoprefixer]
      }
    }),
    {
      name: "my-plugin",
      setup() {
        exec("cp -r public dist/public")
      }
    }
  ]
})
