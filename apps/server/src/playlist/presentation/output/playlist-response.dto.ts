import { ApiProperty } from '@nestjs/swagger';
import {
  ManyPlaylistRead,
  PlaylistEntryRead,
  PlaylistRead,
  UserPlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';
import { API_PREFIX } from 'src/core/config/constants';

export class UserPlaylistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  static fromModel(model: UserPlaylistRead) {
    const dto = new UserPlaylistResponseDto();

    dto.id = model.id;
    dto.name = model.name;
    dto.slug = model.slug;

    return dto;
  }
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

  static fromModel(model: PlaylistEntryRead) {
    const dto = new PlaylistEntryResponseDto();

    dto.id = model.id;
    dto.title = model.title;
    dto.artist = model.artist;
    dto.channel = model.channel;
    dto.duration = model.duration;
    dto.thumbnail = model.thumbnail;
    dto.audio = model.audio;
    dto.mediaId = model.mediaId;
    dto.mediaSource = model.mediaSource;
    dto.position = model.position;

    return dto;
  }
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

  @ApiProperty()
  thumbnails: string[];

  static fromModel(model: PlaylistRead): PlaylistResponseDto {
    const dto = new PlaylistResponseDto();

    dto.id = model.id;
    dto.title = model.title;
    dto.description = model.description;
    dto.visibility = model.visibility;
    dto.user = UserPlaylistResponseDto.fromModel(model.user);
    dto.entries = model.entries.map(PlaylistEntryResponseDto.fromModel);
    dto.thumbnails = [...model.entries]
      .slice(0, 4)
      .map((item) => `${API_PREFIX}/musics/${item.id}/thumbnail`);

    return dto;
  }
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

  @ApiProperty()
  thumbnails: string[];

  static fromModel(mode: ManyPlaylistRead): ManyPlaylistResponseDto {
    const dto = new ManyPlaylistResponseDto();

    dto.id = mode.id;
    dto.title = mode.title;
    dto.description = mode.description;
    dto.visibility = mode.visibility;
    dto.user = UserPlaylistResponseDto.fromModel(mode.user);
    dto.entriesTotal = mode.entriesTotal;
    dto.thumbnails = mode.firstsMusicsIds.map(
      (id) => `${API_PREFIX}/musics/${id}/thumbnail`,
    );

    return dto;
  }
}
