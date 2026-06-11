import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { DeleteMusicCommand } from 'src/music/application/commands/delete-music/delete-music.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@CommandHandler(DeleteMusicCommand)
export class DeleteMusicHandler implements ICommandHandler<DeleteMusicCommand> {
  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicWriteRepository: MusicWriteRepositoryPort,
  ) {}

  async execute(command: DeleteMusicCommand): Promise<void> {
    const { musicId } = command.payload;
    const music = await this.musicWriteRepository.findById(musicId);

    if (!music) throw new RessourceNotFoundException('Music');

    await this.musicWriteRepository.delete(musicId);
  }
}
