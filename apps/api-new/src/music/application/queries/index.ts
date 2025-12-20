import { QueryHandlerType } from '@nestjs/cqrs';
import { FindMusicsHandler } from 'src/music/application/queries/find-musics/find-musics.handler';
import { FindMusicByIdHandler } from 'src/music/application/queries/find-music-by-id/find-music-by-id.handler';
import { SearchMusicsHandler } from 'src/music/application/queries/search-musics/search-musics.handler';

export const musicsQueryHandlers: QueryHandlerType[] = [
  FindMusicsHandler,
  FindMusicByIdHandler,
  SearchMusicsHandler,
];
