import { Kysely, MysqlDialect } from "kysely"
import { createPool } from "mysql2"

import { DB } from "../prisma/types"

const dialect = new MysqlDialect({
  pool: createPool({
    host: "localhost",
    user: "dev",
    password: "azerty123",
    database: "kmotion2",
    port: 3306,
    connectionLimit: 10,
    connectTimeout: 10000,
  }),
})

export const database = new Kysely<DB>({ dialect })
