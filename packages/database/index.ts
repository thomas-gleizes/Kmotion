import * as enums from "./prisma/enums"
import * as types from "./prisma/types"
import { database } from "./src/connexion"

export const prisma = { enums, types }
export default database

database.selectFrom("users").where("email", "is", "kalat@kmotion.fr").executeTakeFirst()
