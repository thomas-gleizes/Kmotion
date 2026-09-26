import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ClipDto } from 'src/music/presentation/dto/input/clip.dto';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export class PreviewMediaQueryDto extends ClipDto {
  @ApiProperty({
    enum: MediaSource,
    description: 'Media source of track',
    example: MediaSource.youtube,
  })
  @IsEnum(MediaSource, { message: 'Invalid source media' })
  mediaSource: MediaSource;
}
