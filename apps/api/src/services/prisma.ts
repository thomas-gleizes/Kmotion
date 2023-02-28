import { PrismaClient } from "@prisma/client"

const Connexion = {
  instance: new PrismaClient()
}

export type ConnexionType = typeof Connexion

Object.freeze(Connexion)

export default Connexion.instance as PrismaClient
