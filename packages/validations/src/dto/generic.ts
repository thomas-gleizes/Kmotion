import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator"
import { Dto } from "../lib/Schema"
import { Type } from "class-transformer"

export class SearchParamsDto extends Dto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  query!: string
}

export class IdNumberDto extends Dto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id!: number
}
