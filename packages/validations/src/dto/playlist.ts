import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator"
import { Type } from "class-transformer"

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title!: string

  @IsString()
  @MaxLength(255)
  description!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(["public", "private"])
  visibility?: "public" | "private" = "public"

  @IsOptional()
  @IsArray()
  musics?: number[]
}

export class UpdatePlaylistDto extends CreatePlaylistDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  id!: number
}

export class GetPlaylistParamsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number
}

export class AddMusicToPlaylistDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  musicId!: number
}

export class QueryGetPlaylist {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  entries?: boolean
}

export class QueryGetPlaylistEntries {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  musics?: boolean
}
