import { Module } from '@nestjs/common';
import { MusicController } from './presentation/music.controller';
import { SyncMusicsTask } from 'src/music/infrastructure/tasks/sync-musics.task';
import { musicsCommandHandlers } from 'src/music/application/commands';

@Module({
  controllers: [MusicController],
  providers: [SyncMusicsTask, ...musicsCommandHandlers],
})
export class MusicModule {}
