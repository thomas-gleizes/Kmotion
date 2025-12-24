import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class AddMusicToPlaylistDto {
  @ApiProperty({
    type: 'string',
    description: 'Music ID to add',
  })
  @IsUUID()
  @IsNotEmpty()
  musicId: string;

  @ApiProperty({
    type: 'number',
    description: 'Position in the playlist',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  position: number;
}
