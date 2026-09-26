import { ApiProperty } from '@nestjs/swagger';
import type { MediaPreview } from 'src/music/domain/port/converter-service.port';

export class ResolvedClipDto {
  @ApiProperty({ type: 'number', description: 'Start in seconds', example: 12 })
  start: number;

  @ApiProperty({ type: 'number', description: 'End in seconds', example: 225 })
  end: number;

  @ApiProperty({
    type: 'number',
    description: 'Length of the kept portion in seconds',
    example: 213,
  })
  duration: number;
}

export class MediaPreviewResponseDto {
  @ApiProperty({
    description: 'Media title',
    example: 'Queen - Bohemian Rhapsody',
  })
  title: string;

  @ApiProperty({
    description: 'Channel that published the media',
    example: 'Queen Official',
  })
  channel: string;

  @ApiProperty({
    type: 'number',
    nullable: true,
    description:
      'Duration of the whole media in seconds, null for live streams',
    example: 354,
  })
  duration: number | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Public URL of the media thumbnail',
  })
  thumbnailUrl: string | null;

  @ApiProperty({
    type: 'number',
    description: 'Longest audio the converter accepts, in seconds',
    example: 1800,
  })
  maxDuration: number;

  @ApiProperty({
    type: ResolvedClipDto,
    nullable: true,
    description:
      'The requested clip resolved to absolute bounds, null when invalid',
  })
  clip: ResolvedClipDto | null;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the (clipped) media is too long to be converted',
  })
  exceedsLimit: boolean;

  static fromPreview(preview: MediaPreview) {
    const dto = new MediaPreviewResponseDto();

    dto.title = preview.title;
    dto.channel = preview.channel;
    dto.duration = preview.duration;
    dto.thumbnailUrl = preview.thumbnailUrl;
    dto.maxDuration = preview.maxDuration;
    dto.clip = preview.clip;
    dto.exceedsLimit = preview.exceedsLimit;

    return dto;
  }
}
