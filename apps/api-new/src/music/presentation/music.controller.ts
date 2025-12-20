import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddMediaBodyDto } from 'src/music/presentation/dto/input/add-media-body.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';
import { number } from 'zod';
import { AddMusicCommand } from 'src/music/application/commands/add-music/add-music.command';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { SearchMusicsQuery } from 'src/music/application/queries/search-musics/search-musics.query';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { MusicResponseDto } from 'src/music/presentation/dto/output/music-response.dto';

@Controller('musics')
@ApiTags('Music')
export class MusicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all music' })
  index() {
    return [];
  }

  @Post('/sync')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'sync',
    summary: 'Sync music with converter service',
  })
  @ApiOkResponse({ type: number, description: 'Music synchronised' })
  async sync() {
    return this.commandBus.execute(new SyncMusicCommand());
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'addMedia',
    summary: 'Add media',
    description: 'Add media to database and convert it by source and id',
  })
  @ApiOkResponse({ description: 'Added media', type: String })
  async addMedia(
    @Body() body: AddMediaBodyDto,
    @CurrentUser() auth: AuthPayload,
  ) {
    return await this.commandBus.execute(
      new AddMusicCommand(body.mediaId, body.mediaSource, auth.sub),
    );
  }

  @Get('/search')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'search', summary: 'Search music' })
  @ApiOkResponse({ type: [String], description: 'Music' })
  async search(@Query('query') query: string) {
    const musics: MusicRead[] = await this.queryBus.execute(
      new SearchMusicsQuery(query),
    );

    return musics.map((music) => MusicResponseDto.fromReadModel(music));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'show', summary: 'Get music by id' })
  @ApiOkResponse({ type: String, description: 'Music' })
  async show(@Param('id') id: string) {
    return id;
  }

  @Get(':id/audio')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getAudio', summary: 'Get music audio' })
  @ApiOkResponse({ type: String, description: 'Music audio' })
  async getAudio(@Param('id') id: string) {
    return id;
  }

  @Get(':id/thumbnail')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getThumbnail',
    summary: 'Get music thumbnail',
  })
  @ApiOkResponse({ type: String, description: 'Music thumbnail' })
  async getThumbnail(@Param('id') id: string) {
    return id;
  }

  @Get('/media/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'showByMediaId',
    summary: 'Find music by media id',
  })
  @ApiOkResponse({ type: String, description: 'Music' })
  async showByMediaId(@Param('id') id: string) {
    return id;
  }
}
