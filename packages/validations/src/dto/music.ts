import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
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
  @Min(8)
  youtubeId!: string
}

export class GetMusicQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number
}

export class BypassMusicParamsDto extends GetMusicPramsDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  code!: string
}
