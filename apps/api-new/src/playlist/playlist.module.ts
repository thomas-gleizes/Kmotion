import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PlaylistController } from 'src/playlist/presentation/playlist.controller';
import { PLAYLIST_WRITE_REPOSITORY } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PlaylistWriteRepository } from 'src/playlist/infrastructure/persistance/repositories/playlist-write.repository';
import {
  playlistCommandHandlers,
  playlistQueryHandlers,
} from 'src/playlist/application';
import { PLAYLIST_READ_REPOSITORY_PORT } from 'src/playlist/application/port/playlist-query-repository.port';
import { PlaylistReadRepository } from 'src/playlist/infrastructure/persistance/repositories/playlist-read.repository';

@Module({
  imports: [AuthModule],
  controllers: [PlaylistController],
  providers: [
    {
      provide: PLAYLIST_WRITE_REPOSITORY,
      useClass: PlaylistWriteRepository,
    },
    {
      provide: PLAYLIST_READ_REPOSITORY_PORT,
      useClass: PlaylistReadRepository,
    },
    ...playlistCommandHandlers,
    ...playlistQueryHandlers,
  ],
})
export class PlaylistModule {}
