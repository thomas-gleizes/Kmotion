import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"
import { Type } from "class-transformer"

export class GetMusicPramsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number
}

export class DownloadMusicParamsDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  youtubeId!: string
}
