import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

export const CONVERTER_SERVICE_PORT = Symbol('CONVERTER_SERVICE');

/** A conversion as seen by kmotion, whatever the converter's own model. */
export type Conversion = {
  converterId: number;
  mediaId: string;
  title: string;
  artist: string;
  duration: number;
  status: ConversionStatus;
};

export interface ConverterServicePort {
  getUnregisterMusics(): Promise<Music[]>;
  /** Starts (or finds) the conversion of a media; it completes asynchronously. */
  requestConversion(
    mediaId: string,
    mediaSource: MediaSource,
  ): Promise<Conversion>;
  /** Current state of a conversion, `null` if the converter no longer has it. */
  getConversion(converterId: number): Promise<Conversion | null>;
}
