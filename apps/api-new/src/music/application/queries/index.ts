import { QueryHandlerType } from '@nestjs/cqrs';
import { FindMusicsHandler } from 'src/music/application/queries/find-musics/find-musics.handler';
import { FindMusicByIdHandler } from 'src/music/application/queries/find-music-by-id/find-music-by-id.handler';
import { SearchMusicsHandler } from 'src/music/application/queries/search-musics/search-musics.handler';
import { FindMusicByMediaIdHandler } from 'src/music/application/queries/find-music-by-media-id/find-music-by-media-id.handler';

export const musicsQueryHandlers: QueryHandlerType[] = [
  FindMusicsHandler,
  FindMusicByIdHandler,
  SearchMusicsHandler,
  FindMusicByMediaIdHandler,
];
