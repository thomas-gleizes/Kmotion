import { FastifyRequest } from "fastify"
import { sign, verify } from "jsonwebtoken"
import { IUser } from "@kmotion/types"

export const signToken = (user: IUser): string => {
  return sign({ user }, process.env.SECRET_SESSION as string, { expiresIn: "31d" })
}

export const verifyToken = (request: FastifyRequest): boolean => {
  if (request.headers.authorization) {
    const token = request.headers.authorization.replace("Bearer ", "")
    console.log("Token", token)

    const decoded = verify(token, process.env.SECRET_SESSION as string)

    console.log("Decoded", decoded)

    // @ts-ignore
    request.session.user = decoded.user as IUser
    request.session.isLogin = true

    return true
  }

  return false
}
