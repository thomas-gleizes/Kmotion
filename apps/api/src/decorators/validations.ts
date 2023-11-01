import { FastifyRequest } from "fastify"
import { ClassConstructor, plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import BadRequestException from "../exceptions/http/BadRequestException"
import { Dto } from "@kmotion/validations"

export function validateBody<S extends Dto>(dtoClass: ClassConstructor<S>) {
  return async (request: FastifyRequest<{ Body: S }>) => {
    const body = plainToInstance(dtoClass, request.body)
    const errors = await validate(body)

    if (errors.length > 0) throw new BadRequestException("A body validation error occurred", errors)

    request.body = body
  }
}

export function validateParams<S extends Dto>(dtoClass: ClassConstructor<S>) {
  return async (request: FastifyRequest<{ Params: S }>) => {
    const params = plainToInstance(dtoClass, request.params)
    const errors = await validate(params)

    if (errors.length > 0)
      throw new BadRequestException("A params validation error occurred", errors)

    request.params = params
  }
}

export function validateQuery<S extends Dto>(dtoClass: ClassConstructor<S>) {
  return async (request: FastifyRequest) => {
    const query = plainToInstance(dtoClass, request.query)
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
