import {
  Controller,
  Get,
  Param,
  NotImplementedException,
} from '@nestjs/common';
import { MusicService } from './music.service';

@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':id')
  async getMusic(@Param('id') id: string) {
    throw new NotImplementedException();
  }

  @Get(':youtube/download')
  async downloadMusic(@Param('youtube') youtubeId: string) {
    console.log('Id', youtubeId);

    await this.musicService.saveMusic(youtubeId);

    return { success: true };
  }

  @Get(':youtube/info')
  async getInfo(@Param('youtube') youtubeId: string) {
    return {
      success: true,
      videoDetails: await this.musicService.showVideosDetails(youtubeId),
    };
  }
}
