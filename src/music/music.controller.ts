import { Controller, Get, Header, Param, StreamableFile, UseGuards } from '@nestjs/common';

import { MusicService } from './music.service';
import { GetUser } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';

@UseGuards(AuthGuard)
@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':youtube/download')
  async addMusic(@Param('youtube') youtubeId: string, @GetUser('id') userId: number) {
    const music = await this.musicService.saveMusic(youtubeId, userId);

    return { success: true, music };
  }

  @Get(':youtube/info')
  async getInfo(@Param('youtube') youtubeId: string) {
    return {
      success: true,
      videoDetails: await this.musicService.showVideosDetails(youtubeId),
    };
  }

  @Get(':youtube/read')
  @Header('Content-Type', 'audio/mp3')
  async download(@Param('youtube') youtubeId: string): Promise<StreamableFile> {
    const stream = await this.musicService.read(youtubeId);

    return new StreamableFile(stream);
  }
}
