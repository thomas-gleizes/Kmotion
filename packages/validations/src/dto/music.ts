import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"

export class GetMusicPramsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number
}

export class YoutubeIdParamsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  youtubeId!: string
}

export class MusicMetaData {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  @IsNotEmpty()
  artist!: string
}

export class MusicCover {
  @IsString()
  @IsNotEmpty()
  @IsEnum(["classic", "custom"])
  type!: string

  @IsString()
  @IsNotEmpty()
  value!: string
}

export class MusicTimeline {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  start!: number

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  end!: number
}

export class ConvertMusicBodyDto {
  @ValidateNested()
  metadata!: MusicMetaData

  @ValidateNested()
  cover!: MusicCover

  @ValidateNested()
  timeline!: MusicTimeline
}

export class GetMusicQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number
}

export class BypassMusicParamsDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  code!: string
}
