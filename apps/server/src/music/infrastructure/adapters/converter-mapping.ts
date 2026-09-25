import type {
  YtTrack,
  YtTrackStatus,
} from 'src/core/converter/yt-converter-http.service';
import type { Conversion } from 'src/music/domain/port/converter-service.port';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';

/** yt-converter statuses, folded into kmotion's three states. */
export const toConversionStatus = (status: YtTrackStatus): ConversionStatus => {
  switch (status) {
    case 'ready':
      return ConversionStatus.ready;
    case 'failed':
      return ConversionStatus.failed;
    default:
      return ConversionStatus.pending;
  }
};

export const toConversion = (track: YtTrack): Conversion => ({
  converterId: track.id,
  mediaId: track.externalId,
  title: track.title,
  artist: track.artist,
  duration: Math.round(track.duration),
  status: toConversionStatus(track.status),
});
