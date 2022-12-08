import Exception from "exceptions/Exception"

abstract class HttpException extends Exception {
  private readonly _status: number

  protected constructor(message: string, status: number) {
    super(message)
    this._status = status
  }

  get status(): number {
    return this._status
  }
}

export default HttpException
