import { Music } from 'src/music/domain/music.entity';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export const CONVERTER_SERVICE_PORT = Symbol('CONVERTER_SERVICE');

export interface ConverterServicePort {
  getUnregisterMusics(): Promise<Music[]>;
  downloadMusic(
    mediaId: string,
    mediaSource: MediaSource,
    downloaderId: string,
  ): Promise<Music>;
}
