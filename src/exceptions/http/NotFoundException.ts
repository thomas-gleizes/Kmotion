import HttpException from "exceptions/http/HttpException"

export default class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || "Not found", 404)
  }
}
