import { access, appendFile, writeFile } from "node:fs/promises"
import { constants } from "node:fs"
import { APP_ROOT } from "./constants"

const TRACE_PATH = `${APP_ROOT}/trace.log`
export default function trace(...args: Array<string | number | undefined>): Promise<void> {
  const content = `${new Date().toLocaleString("fr-FR")}: ${args.join(" ")}`

  console.log(content)

  return access(TRACE_PATH, constants.F_OK)
    .then(() => appendFile(TRACE_PATH, content + "\n"))
    .catch(() => writeFile(TRACE_PATH, content + "\n"))
    .catch((err) => console.log("trace failed", err))
}
