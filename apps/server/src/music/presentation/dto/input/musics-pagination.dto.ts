import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import type {
  MusicSortField,
  SortDirection,
} from 'src/music/application/port/music-read-repository.port';

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

  @ApiProperty({
    type: 'string',
    enum: ['title', 'artist', 'duration', 'createdAt', 'favorite'],
    description: 'Field to order by',
    required: false,
  })
  @IsOptional()
  @IsEnum(['title', 'artist', 'duration', 'createdAt', 'favorite'])
  sort?: MusicSortField;

  @ApiProperty({
    type: 'string',
    enum: ['asc', 'desc'],
    default: 'asc',
    description: 'Order direction',
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: SortDirection;

  @ApiProperty({
    type: 'boolean',
    description: 'Only return favorited musics',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  favorite?: boolean;
}
