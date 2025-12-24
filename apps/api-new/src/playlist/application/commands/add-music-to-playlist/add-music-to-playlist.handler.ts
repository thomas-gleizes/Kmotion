import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
    console.log('Command', command);

    const playlist = await this.playlistWriteRepository.findById(
      command.playlistId,
    );

    if (!playlist.canBeModifiedBy(command.userId)) {
      throw new DomainException('You can not modify this playlist');
    }

    playlist.addMusic(command.musicId, command.position);

    await this.playlistWriteRepository.save(playlist);
  }
}
