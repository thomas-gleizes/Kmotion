import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';
import { MediaSource } from 'src/music/domain/values-object/media-source.value-object';

describe('Music', () => {
  it('starts pending when created from a new conversion', () => {
    const music = Music.create(
      'Title',
      'Artist',
      42,
      'dQw4w9WgXcQ',
      MediaSource.youtube,
      'user-1',
      212,
      '',
      '',
    );

    expect(music.conversionStatus).toBe(ConversionStatus.pending);
    expect(music.isConverted).toBe(false);
  });

  it('is converted only when ready', () => {
    const build = (status: ConversionStatus) =>
      new Music(
        'music-1',
        'Title',
        'Artist',
        42,
        'media-1',
        MediaSource.youtube,
        null,
        212,
        '',
        '',
        new Date(),
        status,
      );

    expect(build(ConversionStatus.ready).isConverted).toBe(true);
    expect(build(ConversionStatus.pending).isConverted).toBe(false);
    expect(build(ConversionStatus.failed).isConverted).toBe(false);
  });
});
