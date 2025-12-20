import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsString()
  @MaxLength(255)
  @MinLength(8)
  password: string;
}
