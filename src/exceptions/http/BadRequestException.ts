import HttpException from "exceptions/http/HttpException"

export default class BadRequestException extends HttpException {
  constructor(message: string, errors?: any) {
    super(message, 400, errors)
  }
}
