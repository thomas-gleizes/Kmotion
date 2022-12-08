import HttpException from "exceptions/http/HttpException"

export default class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(message || "Bad request", 400)
  }
}
