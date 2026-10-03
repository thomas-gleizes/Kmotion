import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { AddMusicCommand } from 'src/music/application/commands/add-music/add-music.command';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { AdminGuard } from 'src/shared/presentation/guards/admin.guard';
import { UpdateMusicDto } from 'src/music/presentation/dto/input/update-music.dto';
import { UpdateMusicCommand } from 'src/music/application/commands/update-music/update-music.command';
import { DeleteMusicCommand } from 'src/music/application/commands/delete-music/delete-music.command';
import { ToggleFavoriteCommand } from 'src/music/application/commands/toggle-favorite/toggle-favorite.command';
import { SearchMusicsQuery } from 'src/music/application/queries/search-musics/search-musics.query';
import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { MusicResponseDto } from 'src/music/presentation/dto/output/music-response.dto';
import { FindMusicsQuery } from 'src/music/application/queries/find-musics/find-musics.query';
import { FindMusicByIdQuery } from 'src/music/application/queries/find-music-by-id/find-music-by-id.query';
import { FindMusicByMediaIdQuery } from 'src/music/application/queries/find-music-by-media-id/find-music-by-media-id.query';
import { MusicsPaginationDto } from 'src/music/presentation/dto/input/musics-pagination.dto';
import {
  ConverterMediaUnavailableError,
  type MediaKind,
  YtConverterHttpService,
} from 'src/core/converter/yt-converter-http.service';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import { MusicsResponseDto } from 'src/music/presentation/dto/output/musics-response.dto';
import { FindConversionsQuery } from 'src/music/application/queries/find-conversions/find-conversions.query';
import { PreviewMediaQuery } from 'src/music/application/queries/preview-media/preview-media.query';
import { PreviewMediaQueryDto } from 'src/music/presentation/dto/input/preview-media-query.dto';
import { MediaPreviewResponseDto } from 'src/music/presentation/dto/output/media-preview-response.dto';
import type { Response as ExpressResponse } from 'express';

@Controller('musics')
@ApiTags('Music')
class MusicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly converterService: YtConverterHttpService,
  ) {}

  /** Streams a converted file; 404 while the conversion is not finished. */
  private async fetchMedia(music: MusicRead | null, kind: MediaKind) {
    if (!music) throw new RessourceNotFoundException('Music');

    try {
      return await this.converterService.fetchMedia(music.converterId, kind);
    } catch (error) {
      if (error instanceof ConverterMediaUnavailableError) {
        throw new RessourceNotFoundException(
          kind === 'audio' ? 'Audio' : 'Thumbnail',
        );
      }
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'musics_index', summary: 'Get all music' })
  @ApiOkResponse({ type: MusicsResponseDto, description: 'Music paginated' })
  async index(
    @Query() pagination: MusicsPaginationDto,
    @CurrentUser() auth: AuthPayload,
  ) {
    const result = await this.queryBus.execute(
      new FindMusicsQuery({
        pagination: { page: pagination.page, size: pagination.size },
        filters: {
          search: pagination.search,
          userId: auth.sub,
          onlyFavorite: pagination.favorite,
        },
        orderBy: {
          field: pagination.sort,
          direction: pagination.order,
          seed: pagination.seed,
        },
      }),
    );

    return MusicsResponseDto.fromResult(result);
  }

  @Put(':id/favorite')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'toggleFavorite',
    summary: 'Toggle favorite status of a music for the current user',
  })
  @ApiOkResponse({ type: Boolean, description: 'New favorite status' })
  async toggleFavorite(
    @Param('id') id: string,
    @CurrentUser() auth: AuthPayload,
  ) {
    return this.commandBus.execute(
      new ToggleFavoriteCommand({ userId: auth.sub, musicId: id }),
    );
  }

  @Post('/sync')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'sync',
    summary: 'Sync music with converter service (admin only)',
  })
  @ApiOkResponse({ type: Number, description: 'Music synchronised' })
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
        clip: body.clip,
      }),
    );
  }

  @Get('/search')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'search', summary: 'Search music' })
  @ApiOkResponse({
    type: MusicResponseDto,
    isArray: true,
    description: 'Music',
  })
  async search(@Query('query') query: string) {
    const musics = await this.queryBus.execute(
      new SearchMusicsQuery({ query }),
    );

    return musics.map((music) => MusicResponseDto.fromReadModel(music));
  }

  // Before `:id`, which would otherwise capture it.
  @Get('/conversions')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'musics_conversions',
    summary:
      'Conversions not ready yet: queued, running or failed (admin only)',
  })
  @ApiOkResponse({
    type: MusicResponseDto,
    isArray: true,
    description: 'Unfinished conversions, oldest first',
  })
  async conversions() {
    const musics = await this.queryBus.execute(
      new FindConversionsQuery(undefined),
    );

    return musics.map((music) => MusicResponseDto.fromReadModel(music));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'musics_show', summary: 'Get music by id' })
  @ApiOkResponse({ type: MusicResponseDto, description: 'Music' })
  async show(@Param('id') id: string) {
    const record = await this.queryBus.execute(
      new FindMusicByIdQuery({ musicId: id }),
    );

    return MusicResponseDto.fromReadModel(record);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'updateMusic',
    summary: 'Update music metadata (admin only)',
  })
  @ApiOkResponse({ type: MusicResponseDto, description: 'Music updated' })
  async update(@Param('id') id: string, @Body() body: UpdateMusicDto) {
    await this.commandBus.execute(
      new UpdateMusicCommand({
        musicId: id,
        title: body.title,
        artist: body.artist,
      }),
    );

    const record = await this.queryBus.execute(
      new FindMusicByIdQuery({ musicId: id }),
    );

    return MusicResponseDto.fromReadModel(record);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'deleteMusic',
    summary: 'Delete a music (admin only)',
  })
  @ApiOkResponse({ description: 'Music deleted' })
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteMusicCommand({ musicId: id }));
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

    const response = await this.fetchMedia(music, 'audio');

    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
      // Contenu immuable pour un id donné : cache navigateur agressif pour
      // éviter les re-téléchargements (survit aux rechargements et sessions).
      'Cache-Control': 'private, max-age=31536000, immutable',
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

    const response = await this.fetchMedia(music, 'thumbnail');

    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
      // Contenu immuable pour un id donné : cache navigateur agressif pour
      // éviter les re-téléchargements (survit aux rechargements et sessions).
      'Cache-Control': 'private, max-age=31536000, immutable',
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

  @Get('/media/:id/preview')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'previewMedia',
    summary: 'Preview a media before adding it',
    description:
      'Details of the media from the converter, and the given clip resolved against it',
  })
  @ApiOkResponse({
    type: MediaPreviewResponseDto,
    description: 'Media preview',
  })
  async previewMedia(
    @Param('id') mediaId: string,
    @Query() query: PreviewMediaQueryDto,
  ) {
    // Query strings are validated but not transformed: parse the bounds here.
    const toSeconds = (value?: number) =>
      value === undefined ? undefined : Number(value);

    const preview = await this.queryBus.execute(
      new PreviewMediaQuery({
        mediaId,
        mediaSource: query.mediaSource,
        clip: { start: toSeconds(query.start), end: toSeconds(query.end) },
      }),
    );

    return MediaPreviewResponseDto.fromPreview(preview);
  }
}

export default MusicController;
