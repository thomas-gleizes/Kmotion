import * as fs from "node:fs/promises"

const TRACE_PATH = `${process.cwd()}/trace.log`
export default function trace(...args: string[]): Promise<void> {
  const content = `${new Date().toLocaleString("fr-FR")}: ${args.join(" ")}`

  console.log(content)

  return fs
    .access(TRACE_PATH, fs.constants.F_OK)
    .then(() => fs.appendFile(TRACE_PATH, content + "\n"))
    .catch(() => fs.writeFile(TRACE_PATH, content + "\n"))
    .catch((err) => console.log("log failed", err))
}
