import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class MusicService {
  constructor(
    private prisma: PrismaService,
    private youtubeService: YoutubeService,
  ) {}

  async saveMusic(id: string) {
    this.youtubeService.setYoutubeId(id);
    await this.youtubeService.download();
  }
}
