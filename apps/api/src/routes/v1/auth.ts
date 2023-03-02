import { FastifyInstance } from "fastify"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import prisma from "../../services/prisma"
import { comparePassword, hashPassword } from "../../utils/security"
import { UnauthorizedException } from "../../exceptions/http/UnauthorizedException"
import { LoginDto, RegisterDto } from "@kmotion/validations"

export default async function authRoutes(instance: FastifyInstance) {
  instance.post<{ Body: LoginDto }>(
    "/login",
    { preHandler: instance.validateBody(LoginDto) },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: {
          email: request.body.email,
        },
      })

      if (!user || (user && (await comparePassword(user.password, request.body.password))))
        throw new UnauthorizedException("Email/Password combination is incorrect")

      if (!user.isActivate)
        throw new UnauthorizedException("Your account must be validate by an admin. Please Wait")

      delete user.password

      request.session.user = user
      request.session.isLogin = true

      reply.send({ success: true, user })
    }
  )

  instance.post<{ Body: RegisterDto }>(
    "/register",
    { preHandler: instance.validateBody(RegisterDto) },
    async (request, reply) => {
      try {
        await prisma.user.create({
          data: {
            email: request.body.email,
            password: await hashPassword(request.body.password),
            name: request.body.name,
            slug: request.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          },
        })

        reply.send({
          success: true,
          message: "You are register but a admin need to confirm your account.",
        })
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError)
          if (error.code === "P2002") throw new UnauthorizedException("credentials already taken")

        throw error
      }
    }
  )

  instance.post("/logout", async (request, reply) => {
    request.session.destroy()

    reply.send({ success: true })
  })

  instance.post("/test", (request, reply) => {
    reply.send({ success: true })
  })
}
