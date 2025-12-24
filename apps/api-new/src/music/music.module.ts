import { Module } from '@nestjs/common';
import MusicController from './presentation/music.controller';
import { SyncMusicsTask } from 'src/music/infrastructure/tasks/sync-musics.task';
import { musicsCommandHandlers } from 'src/music/application/commands';
import { ConverterServiceAdapter } from 'src/music/infrastructure/adapters/converter-service.adapter';
import { ConverterModule } from 'src/core/converter/converter.module';
import { MUSIC_READ_REPOSITORY_PORT } from 'src/music/application/port/music-read-repository.port';
import { MusicReadRepository } from 'src/music/infrastructure/persistance/repository/music-query.repository';
import { CONVERTER_SERVICE_PORT } from 'src/music/domain/port/converter-service.port';
import { MUSIC_WRITE_REPOSITORY_PORT } from 'src/music/domain/port/music-write-repository.port';
import { MusicWriteRepository } from 'src/music/infrastructure/persistance/repository/music-write.repository';
import { MusicsFactory } from 'src/music/infrastructure/factories/musics.factory';
import { AuthModule } from 'src/auth/auth.module';
import { musicsQueryHandlers } from 'src/music/application/queries';

@Module({
  imports: [ConverterModule, AuthModule],
  controllers: [MusicController],
  providers: [
    { provide: MUSIC_READ_REPOSITORY_PORT, useClass: MusicReadRepository },
    { provide: MUSIC_WRITE_REPOSITORY_PORT, useClass: MusicWriteRepository },
    { provide: CONVERTER_SERVICE_PORT, useClass: ConverterServiceAdapter },
    ...musicsCommandHandlers,
    ...musicsQueryHandlers,
    ConverterServiceAdapter,
    MusicsFactory,
    SyncMusicsTask,
  ],
})
export class MusicModule {}
