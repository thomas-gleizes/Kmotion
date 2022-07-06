import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  imports: [YoutubeModule],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
