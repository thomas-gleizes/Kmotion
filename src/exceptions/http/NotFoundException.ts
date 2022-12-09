import HttpException from "exceptions/http/HttpException"

export default class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404, "Not found")
  }
}
