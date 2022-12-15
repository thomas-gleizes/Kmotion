import { FastifyInstance } from "fastify"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js"

import { UnauthorizedException } from "exceptions/http/UnauthorizedException"
import prisma from "utils/prisma"
import { comparePassword, hashPassword } from "utils/security"
import { generateJwt } from "utils/jwt"
import { LoginSchema, RegisterSchema } from "schemas/auth"

export default function authRoutes(instance: FastifyInstance, opts: any, done: Function) {
  instance.post<{ Body: LoginSchema }>("/login", async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: {
        email: request.body.email
      }
    })

    if (!user || (user && (await comparePassword(user.password, request.body.password))))
      throw new UnauthorizedException("Email/Password combination is incorrect")

    if (!user.isActivate)
      throw new UnauthorizedException("Your account must be validate by an admin. Please Wait")

    // @ts-ignore
    delete user.password

    reply.send({ success: true, user, token: generateJwt({ user }) })
  })

  instance.post<{ Body: RegisterSchema }>("/register", async (request, reply) => {
    try {
      await prisma.user.create({
        data: {
          email: request.body.email,
          password: await hashPassword(request.body.password),
          name: request.body.name,
          slug: request.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
        }
      })

      reply.send({
        success: true,
        message: "You are register but a admin need to confirm your account."
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === "P2002") throw new UnauthorizedException("credentials already taken")

      throw error
    }
  })

  done()
}
