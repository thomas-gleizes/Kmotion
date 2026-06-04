import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddMediaBodyDto } from 'src/music/presentation/dto/input/add-media-body.dto';
import { SyncMusicCommand } from 'src/music/application/commands/sync-music/sync-music.command';
import { number } from 'zod';
import { AddMusicCommand } from 'src/music/application/commands/add-music/add-music.command';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { SearchMusicsQuery } from 'src/music/application/queries/search-musics/search-musics.query';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { MusicResponseDto } from 'src/music/presentation/dto/output/music-response.dto';
import { FindMusicsQuery } from 'src/music/application/queries/find-musics/find-musics.query';
import { FindMusicByIdQuery } from 'src/music/application/queries/find-music-by-id/find-music-by-id.query';
import { FindMusicByMediaIdQuery } from 'src/music/application/queries/find-music-by-media-id/find-music-by-media-id.query';
import { MusicsPaginationDto } from 'src/music/presentation/dto/input/musics-pagination.dto';
import { YtConverterHttpService } from 'src/core/converter/yt-converter-http.service';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { MusicsResponseDto } from 'src/music/presentation/dto/output/musics-response.dto';
import type { Response as ExpressResponse } from 'express';

@Controller('musics')
@ApiTags('Music')
class MusicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly converterService: YtConverterHttpService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'index', summary: 'Get all music' })
  @ApiOkResponse({ type: MusicsResponseDto, description: 'Music paginated' })
  async index(@Query() pagination: MusicsPaginationDto) {
    const result = await this.queryBus.execute(
      new FindMusicsQuery({ pagination: pagination, filters: {}, orderBy: {} }),
    );

    return MusicsResponseDto.fromResult(result);
  }

  @Post('/sync')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'sync',
    summary: 'Sync music with converter service',
  })
  @ApiOkResponse({ type: number, description: 'Music synchronised' })
  async sync() {
    await this.commandBus.execute(new SyncMusicCommand(undefined));
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
    return this.commandBus.execute(
      new AddMusicCommand({
        mediaId: body.mediaId,
        mediaSource: body.mediaSource,
        userId: auth.sub,
      }),
    );
  }

  @Get('/search')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'search', summary: 'Search music' })
  @ApiOkResponse({ type: [String], description: 'Music' })
  async search(@Query('query') query: string) {
    const musics = await this.queryBus.execute(
      new SearchMusicsQuery({ query }),
    );

    return musics.map((music) => MusicResponseDto.fromReadModel(music));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'show', summary: 'Get music by id' })
  @ApiOkResponse({ type: String, description: 'Music' })
  async show(@Param('id') id: string) {
    const record = await this.queryBus.execute(
      new FindMusicByIdQuery({ musicId: id }),
    );

    return MusicResponseDto.fromReadModel(record);
  }

  @Get(':id/audio')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'getAudio', summary: 'Get music audio' })
  @ApiProduces('audio/mpeg')
  @ApiOkResponse({
    description: 'Music audio',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getAudio(
    @Param('id') musicId: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const music: MusicRead = await this.queryBus.execute(
      new FindMusicByIdQuery({ musicId }),
    );

    const response = await this.converterService.fetchMedia(music.audio);

    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
    });

    return new StreamableFile(response.data);
  }

  @Get(':id/thumbnail')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'getThumbnail',
    summary: 'Get music thumbnail',
  })
  @ApiProduces('image/jpeg', 'image/png')
  @ApiOkResponse({
    description: 'Music thumbnail',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getThumbnail(
    @Param('id') musicId: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const music = await this.queryBus.execute(
      new FindMusicByIdQuery({ musicId }),
    );

    const response = await this.converterService.fetchMedia(music.thumbnail);

    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
    });

    return new StreamableFile(response.data);
  }

  @Get('/media/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'showByMediaId',
    summary: 'Find music by media id',
  })
  @ApiOkResponse({ type: MusicResponseDto, description: 'Music' })
  async showByMediaId(
    @Param('id') mediaId: string,
    @Query('mediaSource') mediaSource: MediaSource,
  ) {
    const record: MusicRead = await this.queryBus.execute(
      new FindMusicByMediaIdQuery({
        mediaId: mediaId,
        mediaSource: mediaSource,
      }),
    );

    return MusicResponseDto.fromReadModel(record);
  }
}

export default MusicController;
