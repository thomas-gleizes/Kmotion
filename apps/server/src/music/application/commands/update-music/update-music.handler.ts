import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { UpdateMusicCommand } from 'src/music/application/commands/update-music/update-music.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@CommandHandler(UpdateMusicCommand)
export class UpdateMusicHandler implements ICommandHandler<UpdateMusicCommand> {
  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicWriteRepository: MusicWriteRepositoryPort,
  ) {}

  async execute(command: UpdateMusicCommand): Promise<void> {
    const { musicId, title, artist } = command.payload;
    const music = await this.musicWriteRepository.findById(musicId);

    if (!music) throw new RessourceNotFoundException('Music');

    if (title !== undefined) music.title = title;
    if (artist !== undefined) music.artist = artist;

    await this.musicWriteRepository.save(music);
  }
}
