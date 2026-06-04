import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { AddMusicToPlaylistCommand } from './add-music-to-playlist.command';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_WRITE_REPOSITORY,
  type PlaylistWriteRepositoryPort,
} from 'src/playlist/domain/port/playlist-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@CommandHandler(AddMusicToPlaylistCommand)
export class AddMusicToPlaylistHandler
  implements ICommandHandler<AddMusicToPlaylistCommand>
{
  constructor(
    @Inject(PLAYLIST_WRITE_REPOSITORY)
    private readonly playlistWriteRepository: PlaylistWriteRepositoryPort,
  ) {}

  async execute(command: AddMusicToPlaylistCommand) {
    const { playlistId, userId, musicId, position } = command.payload;

    const playlist = await this.playlistWriteRepository.findById(playlistId);

    if (!playlist.canBeModifiedBy(userId)) {
      throw new DomainException('You can not modify this playlist');
    }

    playlist.addMusic(musicId, position);

    await this.playlistWriteRepository.save(playlist);
  }
}
