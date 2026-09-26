/**
 * Portion of a media to keep, in seconds from its start. `start` defaults to
 * the beginning and `end` to the end of the media.
 */
export type Clip = {
  start?: number;
  end?: number;
};
