import HttpException from "exceptions/http/HttpException"

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, 401, "Unauthorized")
  }
}
