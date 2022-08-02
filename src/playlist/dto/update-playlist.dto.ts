import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;
}
