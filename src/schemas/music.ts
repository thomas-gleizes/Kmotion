import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"
import { Type } from "class-transformer"

export class GetMusicParams {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number
}

export class DownloadMusicParams {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  youtubeId!: string
}
