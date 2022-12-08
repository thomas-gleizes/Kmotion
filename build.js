import { build } from "esbuild"
import { nodeExternalsPlugin } from "esbuild-node-externals"

const [, , dev] = process.argv

await build({
  entryPoints: ["src/app.ts"],
  target: "node18",
  format: "esm",
  platform: "node",
  outdir: "dist",
  watch: dev === "--dev",
  logLevel: "debug",
  bundle: true,
  plugins: [nodeExternalsPlugin()]
})
