import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export class AddMediaBodyDto {
  @ApiProperty({
    enum: MediaSource,
    description: 'Media source of track',
    example: MediaSource.youtube,
  })
  @IsEnum(MediaSource, { message: 'Invalid source media' })
  mediaSource: MediaSource;

  @ApiProperty({
    type: String,
    description: 'Id of source media',
    example: 'dQw4w9WgXcQ',
  })
  @IsString()
  @IsNotEmpty()
  mediaId: string;
}
