import { IsEmail, IsNotEmpty, IsString } from "class-validator"

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
  password!: string

  @IsString()
  @IsNotEmpty()
  name!: string
}
