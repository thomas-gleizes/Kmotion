import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';
import { CreatePlaylistDto } from 'src/playlist/presentation/input/create-playlist.dto';
import { CreatePlaylistCommand } from 'src/playlist/application/commands/create-playlist/create-playlist.command';
import { DeletePlaylistCommand } from 'src/playlist/application/commands/delete-playlist/delete-playlist.command';
import { UpdatePlaylistDto } from 'src/playlist/presentation/input/update-playlist.dto';
import { UpdatePlaylistCommand } from 'src/playlist/application/commands/update-playlist/update-playlist.command';
import { FindPlaylistByIdQuery } from 'src/playlist/application/queries/find-playlist-by-id/find-playlist-by-id.query';
import { FindUserPlaylistsQuery } from 'src/playlist/application/queries/find-user-playlists/find-user-playlists.query';
import { FindManyPlaylistsQuery } from 'src/playlist/application/queries/find-many-playlists/find-many-playlists.query';
import { PlaylistPaginationDto } from 'src/playlist/presentation/input/playlist-pagination.dto';
import { AddMusicToPlaylistDto } from 'src/playlist/presentation/input/add-music-to-playlist.dto';
import { AddMusicToPlaylistCommand } from 'src/playlist/application/commands/add-music-to-playlist/add-music-to-playlist.command';
import { RemoveMusicFromPlaylistCommand } from 'src/playlist/application/commands/remove-music-from-playlist/remove-music-from-playlist.command';
import {
  ManyPlaylistResponseDto,
  PlaylistResponseDto,
} from 'src/playlist/presentation/output/playlist-response.dto';
import {
  ManyPlaylistRead,
  PlaylistRead,
} from 'src/playlist/application/port/playlist-query-repository.port';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'create', summary: 'Create a playlist' })
  @ApiCreatedResponse({ type: String, description: 'Playlist created' })
  @ApiBody({ type: CreatePlaylistDto })
  async create(
    @CurrentUser() user: AuthPayload,
    @Body() body: CreatePlaylistDto,
  ) {
    return this.commandBus.execute(
      new CreatePlaylistCommand(
        body.title,
        user.sub,
        body.description,
        body.visibility,
        body.entries,
      ),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'update', summary: 'Update a playlist' })
  @ApiOkResponse({ description: 'Playlist updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthPayload,
    @Body() body: UpdatePlaylistDto,
  ) {
    return this.commandBus.execute(
      new UpdatePlaylistCommand(
        id,
        user.sub,
        body.title,
        body.description,
        body.visibility,
        body.entries,
      ),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'delete', summary: 'Delete a playlist' })
  @ApiOkResponse({ description: 'Playlist deleted' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    await this.commandBus.execute(new DeletePlaylistCommand(id, user.sub));
  }

  @Post(':id/musics')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'addMusic',
    summary: 'Add a music to a playlist',
  })
  @ApiOkResponse({ description: 'Music added to playlist' })
  async addMusic(
    @Param('id') id: string,
    @CurrentUser() user: AuthPayload,
    @Body() body: AddMusicToPlaylistDto,
  ) {
    return this.commandBus.execute(
      new AddMusicToPlaylistCommand(id, user.sub, body.musicId, body.position),
    );
  }

  @Delete(':id/musics/:musicId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'removeMusic',
    summary: 'Remove a music from a playlist',
  })
  @ApiOkResponse({ description: 'Music removed from playlist' })
  async removeMusic(
    @Param('id') id: string,
    @Param('musicId') musicId: string,
    @CurrentUser() user: AuthPayload,
  ) {
    return this.commandBus.execute(
      new RemoveMusicFromPlaylistCommand(id, user.sub, musicId),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'index',
    summary: 'Get all current user playlists',
  })
  @ApiOkResponse({ type: [ManyPlaylistResponseDto] })
  async index(
    @CurrentUser() user: AuthPayload,
    @Query() pagination: PlaylistPaginationDto,
  ) {
    const playlists: ManyPlaylistRead[] = await this.queryBus.execute(
      new FindManyPlaylistsQuery({
        pagination: { page: pagination.page, size: pagination.size },
      }),
    );

    return playlists.map((playlist) =>
      ManyPlaylistResponseDto.fromModel(playlist),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'show', summary: 'Get a playlist' })
  @ApiOkResponse({ type: PlaylistResponseDto })
  async show(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    const playlist: PlaylistRead = await this.queryBus.execute(
      new FindPlaylistByIdQuery(id),
    );

    return PlaylistResponseDto.fromModel(playlist);
  }

  @Get('users/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'showByUserID',
    summary: 'Get playlists of user',
  })
  @ApiOkResponse({ type: [ManyPlaylistResponseDto] })
  async showByUserID(
    @Param('id') userId: string,
    @CurrentUser() user: AuthPayload,
  ) {
    const playlists: ManyPlaylistRead[] = await this.queryBus.execute(
      new FindUserPlaylistsQuery(userId),
    );

    return playlists.map((playlist) =>
      ManyPlaylistResponseDto.fromModel(playlist),
    );
  }
}
