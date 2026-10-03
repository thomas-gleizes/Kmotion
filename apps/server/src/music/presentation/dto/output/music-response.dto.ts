import { ApiProperty } from '@nestjs/swagger';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';

export class MusicResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the track',
    example: 'c8b6f7a2-3e4d-4c9a-9c2e-8c9f1d2a3b4c',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Track title',
    example: 'Bohemian Rhapsody',
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Name of the artist or band',
    example: 'Queen',
    minLength: 1,
    maxLength: 255,
  })
  artist: string;

  @ApiProperty({
    description: 'Source platform or channel of the track',
    example: 'youtube',
    enum: ['youtube', 'spotify', 'soundcloud', 'local'],
  })
  channel: string;

  @ApiProperty({
    description: 'Total track duration in seconds',
    example: 354,
    minimum: 0,
  })
  duration: number;

  @ApiProperty({ enum: MediaSource, description: 'Media source of track' })
  mediaSource: MediaSource;

  @ApiProperty({ type: String, description: 'Id of source media' })
  mediaId: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the audio has been converted and is available',
    example: true,
  })
  converted: boolean;

  @ApiProperty({
    enum: ConversionStatus,
    description: 'Conversion state of the audio (`converted` is `ready`)',
    example: ConversionStatus.ready,
  })
  conversionStatus: ConversionStatus;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Why the conversion failed, `null` unless it did',
    example: null,
  })
  conversionError: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'When the track was added to the library',
  })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the current user has favorited this track',
    example: false,
  })
  isFavorite: boolean;

  static fromReadModel(model: MusicRead) {
    const dto = new MusicResponseDto();

    dto.id = model.id;
    dto.title = model.title;
    dto.artist = model.artist;
    dto.channel = model.channel;
    dto.duration = model.duration;
    dto.mediaSource = model.mediaSource;
    dto.mediaId = model.mediaId;
    dto.converted = model.converted;
    dto.conversionStatus = model.conversionStatus;
    dto.conversionError = model.conversionError;
    dto.createdAt = model.createdAt;
    dto.isFavorite = model.isFavorite;

    return dto;
  }
}
