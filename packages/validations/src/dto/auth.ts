import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Dto } from "../lib/Schema";

export class LoginDto extends Dto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RegisterDto extends Dto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
}
