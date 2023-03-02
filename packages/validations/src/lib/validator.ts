import "reflect-metadata"
import { ValidationError } from "class-validator"
import { values, size } from "lodash"

function convertErrorToFormikFormat(errors: Array<ValidationError>) {
  const result = {}

  for (const error of errors) {
    result[error.property] = values(error.constraints)[0]
    if (size(error.children) > 0) {
      result[error.property] = convertErrorToFormikFormat(error.children)
    }
  }

  return result
}

export function validateFormik() {}
