import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginSchema {
  @IsString()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}

export class RegisterSchema {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string
}
