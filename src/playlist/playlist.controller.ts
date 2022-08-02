import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';
import { AuthGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlaylistDto: CreatePlaylistDto, @GetUser('id') userId: number) {
    const playlist = await this.playlistService.create(createPlaylistDto, userId);

    return { success: true, playlist };
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    const playlist = await this.playlistService.findById(id);

    return { success: true, playlist };
  }

  @Get('/slug/:slug')
  async findBySlug(@Param(':slug') slug: string) {
    const playlist = await this.playlistService.findBySlug(slug);

    return { success: true, playlist };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @GetUser('id') userId: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto
  ) {
    await this.playlistService.update(id, userId, updatePlaylistDto);
    const playlist = await this.playlistService.findById(id);

    return { success: true, playlist };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @GetUser('id') userId: number) {
    const playlist = await this.playlistService.remove(id, userId);

    if (!playlist) throw new NotFoundException('Playlist not found');
  }

  @Patch(':id/musics')
  @UseGuards(AuthGuard)
  async addMusics(
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @Body('musicId') musicId: string
  ) {
    const entry = await this.playlistService.addEntry(+id, userId, +musicId);

    return { success: true, entry };
  }
}
