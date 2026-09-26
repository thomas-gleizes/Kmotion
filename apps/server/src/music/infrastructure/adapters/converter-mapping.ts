import { isAxiosError } from 'axios';
import type {
  YtErrorBody,
  YtSourcePreview,
  YtTrack,
  YtTrackStatus,
} from 'src/core/converter/yt-converter-http.service';
import type {
  Conversion,
  MediaPreview,
} from 'src/music/domain/port/converter-service.port';
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

export const toMediaPreview = ({
  info,
  maxDuration,
  clip,
  exceedsLimit,
}: YtSourcePreview): MediaPreview => ({
  title: info.title,
  channel: info.channel,
  duration: info.duration,
  thumbnailUrl: info.thumbnailUrl,
  maxDuration,
  clip: clip && { start: clip.start, end: clip.end, duration: clip.duration },
  exceedsLimit,
});

/**
 * Explains a rejected converter request to the user, `null` when the failure
 * is not the request's fault (network, converter crash…).
 */
export const describeConverterError = (error: unknown): string | null => {
  if (!isAxiosError<YtErrorBody>(error) || !error.response) return null;

  const body = error.response.data ?? {};

  switch (body._tag) {
    case 'InvalidClip':
      return `Invalid clip: ${body.reason}`;
    case 'DurationLimitExceeded':
      return `Media is longer than the allowed ${Math.floor((body.limit ?? 0) / 60)} minutes`;
    case 'InvalidSource':
      return 'Invalid media';
    case 'SourceUnavailable':
      return 'Media is unavailable';
    default:
      return null;
  }
};
