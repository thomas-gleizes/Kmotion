import { FastifyInstance } from "fastify"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { LoginDto, RegisterDto } from "@kmotion/validations"
import { LoginResponse } from "@kmotion/types"
import { userMapper } from "@kmotion/mappers"
import prisma from "../../services/prisma"
import { bcryptCompare, bcryptHash } from "../../utils/hash"
import { UnauthorizedException } from "../../exceptions/http/UnauthorizedException"
import { signToken } from "../../utils/token"

export default async function authRoutes(instance: FastifyInstance) {
  instance.post<{ Body: LoginDto; Reply: LoginResponse }>(
    "/login",
    { preHandler: instance.validateBody(LoginDto) },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: {
          email: request.body.email,
        },
      })

      if (!user || (user && (await bcryptCompare(user.password, request.body.password))))
        throw new UnauthorizedException("Email/Password combination is incorrect")

      if (!user.isActivate)
        throw new UnauthorizedException("Your account must be validate by an admin. Please Wait")

      const mappedUser = userMapper.one(user)

      request.session.user = mappedUser
      request.session.isLogin = true

      reply.send({ success: true, user: mappedUser, token: signToken(mappedUser) })
    }
  )

  instance.post<{ Body: RegisterDto }>(
    "/register",
    { preHandler: instance.validateBody(RegisterDto) },
    async (request, reply) => {
      try {
        const user = await prisma.user.create({
          data: {
            email: request.body.email,
            password: await bcryptHash(request.body.password),
            name: request.body.name,
            slug: request.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          },
        })

        console.log("User", user)

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
}
