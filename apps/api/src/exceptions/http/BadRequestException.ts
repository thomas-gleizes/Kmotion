import HttpException from "./HttpException"

export default class BadRequestException extends HttpException {
  constructor(message: string, errors?: object) {
    super(message, 400, errors)
  }
}
