import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddMusicCommand } from 'src/music/application/commands/add-music/add-music.command';
import {
  MUSIC_WRITE_REPOSITORY_PORT,
  type MusicWriteRepositoryPort,
} from 'src/music/domain/port/music-write-repository.port';
import { Inject } from '@nestjs/common';
import {
  CONVERTER_SERVICE_PORT,
  type ConverterServicePort,
} from 'src/music/domain/port/converter-service.port';

@CommandHandler(AddMusicCommand)
export class AddMusicHandler implements ICommandHandler<
  AddMusicCommand,
  string
> {
  constructor(
    @Inject(MUSIC_WRITE_REPOSITORY_PORT)
    private readonly musicRepository: MusicWriteRepositoryPort,
    @Inject(CONVERTER_SERVICE_PORT)
    private readonly converterService: ConverterServicePort,
  ) {}

  async execute(command: AddMusicCommand): Promise<string> {
    const music = await this.converterService.downloadMusic(
      command.mediaId,
      command.mediaSource,
      command.userId,
    );

    await this.musicRepository.save(music);

    return music.id;
  }
}
