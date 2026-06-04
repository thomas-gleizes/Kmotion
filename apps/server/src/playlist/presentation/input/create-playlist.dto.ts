import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { Type } from 'class-transformer';

export class PlaylistEntryDto {
  @ApiProperty({
    type: 'string',
    description: 'Playlist music id',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  musicId: string;

  @ApiProperty({
    type: 'number',
    description: 'Playlist music position',
  })
  @IsNumber()
  @IsPositive()
  position: number;
}

export class CreatePlaylistDto {
  @ApiProperty({
    type: 'string',
    description: 'Playlist title',
    maxLength: 50,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'Playlist description',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'Playlist visibility',
    enum: Visibility,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiProperty({
    type: [PlaylistEntryDto],
    description: 'Playlist musics ids',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaylistEntryDto)
  entries?: PlaylistEntryDto[];
}
