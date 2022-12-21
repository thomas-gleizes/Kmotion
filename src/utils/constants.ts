import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

export const APP_PORT: number = Number(process.env.PORT) || 8000
export const APP_ROOT: string = dirname(dirname(fileURLToPath(import.meta.url)))
export const APP_DIST: string = `${APP_ROOT}/dist`
