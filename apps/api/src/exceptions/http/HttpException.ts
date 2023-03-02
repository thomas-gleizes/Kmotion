import Exception from "../Exception"

abstract class HttpException<Errors extends object = object> extends Exception {
  private readonly _status: number
  private readonly _errors?: Errors

  protected constructor(message: string, status: number, errors?: Errors) {
    super(message)
    this._status = status
    this._errors = errors
  }

  get status(): number {
    return this._status
  }

  get errors(): Errors | undefined {
    return this._errors
  }

  toJSON(): object {
    const base: { success: false; message: string; errors?: object } = {
      success: false,
      message: this.message,
    }

    if (typeof this.errors !== "undefined") base.errors = this.errors

    return base
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default HttpException
