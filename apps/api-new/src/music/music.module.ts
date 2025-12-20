import { Module } from '@nestjs/common';
import { MusicController } from './presentation/music.controller';
import { SyncMusicsTask } from 'src/music/infrastructure/tasks/sync-musics.task';
import { musicsCommandHandlers } from 'src/music/application/commands';
import { ConverterServiceAdapter } from 'src/music/infrastructure/adapters/converter-service-adapter.service';
import { ConverterModule } from 'src/core/converter/converter.module';
import { MUSIC_READ_REPOSITORY_PORT } from 'src/music/application/port/music-read-repository.port';
import { MusicReadRepository } from 'src/music/infrastructure/persistance/repository/music-query.repository';
import { CONVERTER_SERVICE_PORT } from 'src/music/domain/port/converter-service.port';
import { MUSIC_WRITE_REPOSITORY_PORT } from 'src/music/domain/port/music-write-repository.port';
import { MusicWriteRepository } from 'src/music/infrastructure/persistance/repository/music-write.repository';

@Module({
  imports: [ConverterModule],
  controllers: [MusicController],
  providers: [
    { provide: MUSIC_READ_REPOSITORY_PORT, useClass: MusicReadRepository },
    { provide: MUSIC_WRITE_REPOSITORY_PORT, useClass: MusicWriteRepository },
    { provide: CONVERTER_SERVICE_PORT, useClass: ConverterServiceAdapter },
    ...musicsCommandHandlers,
    ConverterServiceAdapter,
    SyncMusicsTask,
  ],
})
export class MusicModule {}
