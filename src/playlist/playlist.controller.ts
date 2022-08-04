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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, GetMusicsDto, UpdatePlaylistDto } from './dto';
import { GetUser } from '../auth/decorator';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number) {
    const playlist = await this.playlistService.findById(id);

    return { success: true, playlist };
  }

  @Get('/slug/:slug')
  async findBySlug(@Param(':slug') slug: string) {
    const playlist = await this.playlistService.findBySlug(slug);

    return { success: true, playlist };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlaylistDto: CreatePlaylistDto, @GetUser('id') userId: number) {
    const playlist = await this.playlistService.create(createPlaylistDto, userId);

    return { success: true, playlist };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto
  ) {
    await this.playlistService.update(id, userId, updatePlaylistDto);
    const playlist = await this.playlistService.findById(id);

    return { success: true, playlist };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    const playlist = await this.playlistService.remove(id, userId);

    if (!playlist) throw new NotFoundException('Playlist not found');
  }

  @Get(':id/musics')
  async getMusics(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
    @Query() queryParams: GetMusicsDto
  ) {
    const musics = await this.playlistService.showEntry(
      id,
      userId,
      queryParams.limit,
      queryParams.offset
    );

    return { success: true, musics };
  }

  @Post(':id/musics')
  @HttpCode(HttpStatus.CREATED)
  async addMusics(
    @Param('id', ParseIntPipe) id: number,
    @Body('musicId', ParseIntPipe) musicId: number,
    @GetUser('id') userId: number
  ) {
    const entry = await this.playlistService.addEntry(id, musicId, userId);

    return { success: true, entry };
  }

  @Delete(':id/musics/:musicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMusic(
    @Param('id', ParseIntPipe) id: number,
    @Param('musicId', ParseIntPipe) musicId: number,
    @GetUser('id') userId: number
  ) {
    const meta = await this.playlistService.deleteEntry(id, musicId, userId);

    return { success: true, meta };
  }
}
