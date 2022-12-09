import HttpException from "exceptions/http/HttpException"

export default class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, 400, "Bad request")
  }
}
