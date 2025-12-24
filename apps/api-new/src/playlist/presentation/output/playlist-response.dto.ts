import { ApiProperty } from '@nestjs/swagger';

export class UserPlaylistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class PlaylistEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  artist: string;

  @ApiProperty()
  channel: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  audio: string;

  @ApiProperty()
  mediaId: string;

  @ApiProperty()
  mediaSource: string;

  @ApiProperty()
  position: number;
}

export class PlaylistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['public', 'private'] })
  visibility: string;

  @ApiProperty({ type: UserPlaylistResponseDto })
  user: UserPlaylistResponseDto;

  @ApiProperty({ type: [PlaylistEntryResponseDto] })
  entries: PlaylistEntryResponseDto[];
}

export class ManyPlaylistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['public', 'private'] })
  visibility: string;

  @ApiProperty({ type: UserPlaylistResponseDto })
  user: UserPlaylistResponseDto;

  @ApiProperty()
  entriesTotal: number;
}
