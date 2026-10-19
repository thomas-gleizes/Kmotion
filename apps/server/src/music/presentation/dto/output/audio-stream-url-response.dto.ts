import { ApiProperty } from '@nestjs/swagger';

export class AudioStreamUrlResponseDto {
  @ApiProperty({
    description:
      'Signed, expiring audio URL, usable directly as an `<audio>` source (supports `Range`)',
    example:
      '/api/3.1/musics/c8b6f7a2-3e4d-4c9a-9c2e-8c9f1d2a3b4c/stream?expires=1792540800000&signature=…',
  })
  url: string;

  static of(url: string): AudioStreamUrlResponseDto {
    const dto = new AudioStreamUrlResponseDto();
    dto.url = url;
    return dto;
  }
}
