import { IsNotEmpty, IsString } from "class-validator"
import { validationMetadatasToSchemas } from "class-validator-jsonschema"

export class LoginSchema {
  @IsString()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}

const schemas = validationMetadatasToSchemas()

console.log("Schemas", schemas)
