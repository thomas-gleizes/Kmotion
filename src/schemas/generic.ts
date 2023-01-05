import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class SearchParamsSchema {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  query!: string
}
