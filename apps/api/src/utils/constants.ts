import { config } from "dotenv";

config({ path: "../../.env" });

export const APP_PORT: number = Number(process.env.PORT) || 8000;
export const APP_ROOT = process.cwd();
export const APP_PUBLIC = `${APP_ROOT}/public`;
