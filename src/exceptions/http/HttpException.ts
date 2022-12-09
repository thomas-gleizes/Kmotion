import Exception from "exceptions/Exception"

abstract class HttpException extends Exception {
  private readonly _status: number
  private readonly _error: string

  protected constructor(message: string, status: number, error: string) {
    super(message)
    this._status = status
    this._error = error
  }

  get status(): number {
    return this._status
  }

  get error(): string {
    return this._error
  }

  toJSON(): object {
    return {
      status: this.status,
      error: this.error,
      message: this.message
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default HttpException
