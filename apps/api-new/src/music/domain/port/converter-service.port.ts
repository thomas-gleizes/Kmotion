import { Music } from 'src/music/domain/music.entity';

export const CONVERTER_SERVICE_PORT = Symbol('CONVERTER_SERVICE');

export interface ConverterServicePort {
  getUnregisterMusics(): Promise<Music[]>;
}
