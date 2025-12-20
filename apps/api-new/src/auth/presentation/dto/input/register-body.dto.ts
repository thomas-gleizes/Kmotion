import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RegisterBodyDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiProperty({ type: 'string', format: 'email' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsString()
  @Length(8, 255)
  password: string;
}
