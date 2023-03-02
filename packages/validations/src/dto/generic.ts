import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Dto } from "../lib/Schema";

export class SearchParamsDto extends Dto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  query!: string;
}
