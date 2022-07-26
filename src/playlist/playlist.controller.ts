import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';
import { AuthGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(AuthGuard)
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  async create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @GetUser('id') userId: number,
  ) {
    const playlist = await this.playlistService.create(
      createPlaylistDto,
      userId,
    );

    return { success: true, playlist };
  }

  @Get()
  async findAll(@GetUser('id') userId: number) {
    const playlist = await this.playlistService.findAllByUser(userId);

    return { success: true, playlist };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    throw new NotImplementedException();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    throw new NotImplementedException();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new NotImplementedException();
  }
}
