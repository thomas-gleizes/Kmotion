import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import {
  PaginateParameter,
  PaginateResult,
} from 'src/core/paginations/paginations.type';

export type MusicRead = {
  id: string;
  mediaId: string;
  mediaSource: MediaSource;
  title: string;
  artist: string;
  channel: string;
  duration: number;
  audio: string;
  thumbnail: string;
};

export type MusicFilters = {};

export type MusicOrderBy = {};

export const MUSIC_READ_REPOSITORY_PORT = Symbol('MUSIC_READ_REPOSITORY_PORT');

export interface MusicReadRepositoryPort {
  exist(converterId: number): Promise<boolean>;

  search(query: string): Promise<MusicRead[]>;

  findAll(
    params: PaginateParameter<MusicFilters, MusicOrderBy>,
  ): Promise<PaginateResult<MusicRead>>;

  findById(id: string): Promise<MusicRead | null>;

  findByMediaId(
    mediaId: string,
    mediaSource: MediaSource,
  ): Promise<MusicRead | null>;
}
