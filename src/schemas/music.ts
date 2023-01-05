import { IsNotEmpty, IsString, Min } from "class-validator"

export class GetMusicParams {
  @IsString()
  @IsNotEmpty()
  @Min(1)
  id!: number
}

export class DownloadMusicParams {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  youtubeId!: string
}
