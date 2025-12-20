import { ApiProperty } from '@nestjs/swagger';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';

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

  @ApiProperty({
    description: 'URL pointing to the audio stream or audio file',
    example: 'https://cdn.example.com/audio/bohemian-rhapsody.mp3',
    format: 'uri',
  })
  audio: string;

  @ApiProperty({
    description: 'URL of the track thumbnail image',
    example: 'https://cdn.example.com/thumbnails/bohemian-rhapsody.jpg',
    format: 'uri',
  })
  thumbnail: string;

  static fromReadModel(model: MusicRead) {
    const dto = new MusicResponseDto();

    dto.id = model.id;
    dto.title = model.title;
    dto.artist = model.artist;
    dto.channel = model.channel;
    dto.duration = model.duration;
    dto.audio = model.audio;
    dto.thumbnail = model.thumbnail;

    return dto;
  }
}
