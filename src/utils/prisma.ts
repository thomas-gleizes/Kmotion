import { PrismaClient } from "@prisma/client"

const Connexion = {
  instance: typeof window === "undefined" ? new PrismaClient() : null
}

export type ConnexionType = typeof Connexion

Object.freeze(Connexion)

export default Connexion.instance as PrismaClient
