import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import YoutubeService from '../youtube/youtube.service';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) {}

  async saveMusic(id: string) {
    const youtube = new YoutubeService(id);

    await youtube.download();
  }

  async showVideosDetails(id: string) {
    const youtube = new YoutubeService(id);

    return youtube.getVideoDetails();
  }
}
