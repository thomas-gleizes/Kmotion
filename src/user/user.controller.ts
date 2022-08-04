import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import type { Playlist, User } from 'model';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { UpdateUserDto } from './user.dto';
import { AdminGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async find(@Param('id', ParseIntPipe) bookmarkId: number) {
    const user = await this.userService.findById(bookmarkId);

    if (!user) throw new NotFoundException('User not found');

    return { success: true, user };
  }

  @Patch('/')
  async update(@GetUser('id', ParseIntPipe) userId: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(userId, dto);

    return { success: true, user };
  }

  @UseGuards(AdminGuard)
  @Patch('/:id/activate')
  async activate(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.userService.activate(userId);

    return { success: true, user };
  }

  @Get('/:id/playlists')
  async getPlayLists(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    let playlists: Playlist[];

    if (user?.id === id) playlists = await this.userService.showPlaylists(id);
    else playlists = await this.userService.showPublicPlaylists(id);

    return { success: true, playlists };
  }
}
