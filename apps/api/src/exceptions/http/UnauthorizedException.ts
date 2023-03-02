import HttpException from "./HttpException"

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, 401, { name: "Unauthorized" })
  }
}
