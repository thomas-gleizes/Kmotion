import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';
import type { Clip } from 'src/music/domain/values-object/clip.value-object';

export const CONVERTER_SERVICE_PORT = Symbol('CONVERTER_SERVICE');

/** A conversion as seen by kmotion, whatever the converter's own model. */
export type Conversion = {
  converterId: number;
  mediaId: string;
  title: string;
  artist: string;
  duration: number;
  status: ConversionStatus;
  /** Why the conversion failed, `null` unless it did. */
  error: string | null;
};

/** What the converter knows about a media before converting it. */
export type MediaPreview = {
  title: string;
  channel: string;
  /** Seconds, `null` when unknown (live streams). */
  duration: number | null;
  thumbnailUrl: string | null;
  /** Longest audio the converter accepts, in seconds. */
  maxDuration: number;
  /** The requested clip resolved to absolute bounds, `null` when invalid. */
  clip: { start: number; end: number; duration: number } | null;
  exceedsLimit: boolean;
};

export interface ConverterServicePort {
  getUnregisterMusics(): Promise<Music[]>;
  /** Starts (or finds) the conversion of a media; it completes asynchronously. */
  requestConversion(
    mediaId: string,
    mediaSource: MediaSource,
    clip?: Clip,
  ): Promise<Conversion>;
  /** Inspects a media, and optionally a clip of it, without converting it. */
  previewMedia(
    mediaId: string,
    mediaSource: MediaSource,
    clip?: Clip,
  ): Promise<MediaPreview>;
  /** Queues a failed conversion again, keeping its clip and format. */
  retryConversion(converterId: number): Promise<Conversion>;
  /** Current state of a conversion, `null` if the converter no longer has it. */
  getConversion(converterId: number): Promise<Conversion | null>;
}
