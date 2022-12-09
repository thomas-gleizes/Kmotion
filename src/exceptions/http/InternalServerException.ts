import HttpException from "exceptions/http/HttpException"

export default class InternalServerException extends HttpException {
  constructor(message: string) {
    super(message, 500, "Internal Server Error")
  }
}
