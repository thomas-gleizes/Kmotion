import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator"
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
