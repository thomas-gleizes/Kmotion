import Exception from "exceptions/Exception"

abstract class HttpException extends Exception {
  private readonly _status: number
  private readonly _errors?: any

  protected constructor(message: string, status: number, errors?: any) {
    super(message)
    this._status = status
    this._errors = errors
  }

  get status(): number {
    return this._status
  }

  get errors(): any {
    return this._errors
  }

  toJSON(): object {
    const base: { success: false; message: string; errors?: object } = {
      success: false,
      message: this.message
    }

    if (typeof this.errors !== "undefined") base.errors = this.errors

    return base
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default HttpException
