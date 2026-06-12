import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MusicsPaginationDto {
  @ApiProperty({
    type: 'number',
    default: 0,
    description: 'Page',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page: number = 0;

  @ApiProperty({
    type: 'number',
    default: 20,
    description: 'Size',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(5)
  @Max(200)
  size: number = 20;

  @ApiProperty({
    type: 'string',
    description: 'Search by title or artist',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
