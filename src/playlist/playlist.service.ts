import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    this.prisma.playlist.create({
      data: {
        title: createPlaylistDto.title,
        slug: createPlaylistDto.title.toLowerCase().replace(/\s/g, '-'),
        description: createPlaylistDto.description,
        authorId: userId,
      },
    });
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
