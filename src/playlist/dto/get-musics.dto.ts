import { IsInt, IsNotEmpty, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMusicsDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @Max(50)
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  @Min(0)
  offset: number;
}
