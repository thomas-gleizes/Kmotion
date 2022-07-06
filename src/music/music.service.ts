import { Injectable } from '@nestjs/common';
import { Music as MusicModel } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) {}

  async saveMusic(id: string) {}
}
