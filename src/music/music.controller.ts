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

  @Get(':youtube-id/download')
  async downloadMusic(@Param('youtube-id') youtubeId: string) {
    await this.musicService.saveMusic(youtubeId);

    return { success: true };
  }
}
