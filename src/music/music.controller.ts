import { Controller, Get, NotImplementedException, Param, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { AuthGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(AuthGuard)
@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {
  }

  @Get(':id')
  async getMusic(@Param('id') id: string) {
    throw new NotImplementedException();
  }

  @Get(':youtube/download')
  async addMusic(
    @Param('youtube') youtubeId: string,
    @GetUser('id') userId: number
  ) {
    await this.musicService.saveMusic(youtubeId, userId);

    return { success: true };
  }

  @Get(':youtube/info')
  async getInfo(@Param('youtube') youtubeId: string) {
    return {
      success: true,
      videoDetails: await this.musicService.showVideosDetails(youtubeId)
    };
  }
}
