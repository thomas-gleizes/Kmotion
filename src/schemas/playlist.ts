import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreatePlaylistSchema {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  description!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  visibility!: "public" | "private"
}

export class UpdatePlaylistSchema {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  description!: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  visibility!: "public" | "private"
}
