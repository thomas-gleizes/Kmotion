import { FastifyRequest } from "fastify"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"

import BadRequestException from "../exceptions/http/BadRequestException"

export function validateBody(dtoClass: any) {
  return async (request: FastifyRequest) => {
    const body: typeof dtoClass = plainToClass(dtoClass, request.body)
    const errors = await validate(body)

    if (errors.length > 0) throw new BadRequestException("A body validation error occurred", errors)

    request.body = body
  }
}

export function validateParams(dtoClass: any) {
  return async (request: FastifyRequest) => {
    const params: typeof dtoClass = plainToClass(dtoClass, request.params)
    const errors = await validate(params)

    if (errors.length > 0)
      throw new BadRequestException("A params validation error occurred", errors)

    request.params = params
  }
}

export function validateQuery(dtoClass: any) {
  return async (request: FastifyRequest) => {
    const query: typeof dtoClass = plainToClass(dtoClass, request.query)
    const errors = await validate(query)

    if (errors.length > 0)
      throw new BadRequestException("A query validation error occurred", errors)

    request.query = query
  }
}

declare module "fastify" {
  export interface FastifyInstance {
    validateBody: typeof validateBody
    validateParams: typeof validateParams
    validateQuery: typeof validateQuery
  }
}
