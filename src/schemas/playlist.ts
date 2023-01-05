import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from "class-validator"
import { Type } from "class-transformer"

export class CreatePlaylistSchema {
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
  visibility: "public" | "private" = "public"
}

export class UpdatePlaylistSchema {
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
  visibility!: "public" | "private"
}

export class GetPlaylistSchema {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  id!: number
}

export class AddMusicToPlaylistSchema {
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
