import { PlaylistEntries } from './playlist-entries.value-object';
import { InvalidPositionException } from '../exceptions/invalid-position.exception';
import { MusicAlreadyInPlaylistException } from '../exceptions/music-already-in-playlist.exception';
import { MusicNotFoundInPlaylistException } from '../exceptions/music-not-found-in-playlist.exception';

describe('PlaylistEntries', () => {
  it('should add a music to the playlist at the end if no position is specified', () => {
    const playlist = new PlaylistEntries([]);
    playlist.add('music-1', 0);
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-1', position: 0 },
    ]);
  });

  it('should shift following musics when adding at an existing position', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
    ]);
    playlist.add('music-3', 0);
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-3', position: 0 },
      { musicId: 'music-1', position: 1 },
      { musicId: 'music-2', position: 2 },
    ]);
  });

  it('should not allow adding the same music twice', () => {
    const playlist = new PlaylistEntries([{ musicId: 'music-1', position: 0 }]);
    expect(() => playlist.add('music-1', 1)).toThrow(
      MusicAlreadyInPlaylistException,
    );
  });

  it('should remove a music and shift following ones', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
      { musicId: 'music-3', position: 2 },
    ]);
    playlist.remove('music-2');
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-3', position: 1 },
    ]);
  });

  it('should move a music to a new position (forward)', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
      { musicId: 'music-3', position: 2 },
    ]);
    playlist.move('music-1', 2);
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-2', position: 0 },
      { musicId: 'music-3', position: 1 },
      { musicId: 'music-1', position: 2 },
    ]);
  });

  it('should move a music to a new position (backward)', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
      { musicId: 'music-3', position: 2 },
    ]);
    playlist.move('music-3', 0);
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-3', position: 0 },
      { musicId: 'music-1', position: 1 },
      { musicId: 'music-2', position: 2 },
    ]);
  });

  it('should throw MusicNotFoundInPlaylistException if music not found during remove', () => {
    const playlist = new PlaylistEntries([]);
    expect(() => playlist.remove('unknown')).toThrow(
      MusicNotFoundInPlaylistException,
    );
  });

  it('should throw MusicNotFoundInPlaylistException if music not found during move', () => {
    const playlist = new PlaylistEntries([]);
    expect(() => playlist.move('unknown', 0)).toThrow(
      MusicNotFoundInPlaylistException,
    );
  });

  it('should throw InvalidPositionException if position is negative', () => {
    const playlist = new PlaylistEntries([]);
    expect(() => playlist.add('music-1', -1)).toThrow(InvalidPositionException);
  });

  it('should reorder entries and normalize positions', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
      { musicId: 'music-3', position: 2 },
    ]);
    playlist.reorder([
      { musicId: 'music-3', position: 5 },
      { musicId: 'music-1', position: 8 },
      { musicId: 'music-2', position: 12 },
    ]);
    expect(playlist.getEntries()).toEqual([
      { musicId: 'music-3', position: 0 },
      { musicId: 'music-1', position: 1 },
      { musicId: 'music-2', position: 2 },
    ]);
  });

  it('should throw if reorder does not describe the exact same musics', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
    ]);
    expect(() =>
      playlist.reorder([
        { musicId: 'music-1', position: 0 },
        { musicId: 'unknown', position: 1 },
      ]),
    ).toThrow(MusicNotFoundInPlaylistException);
  });

  it('should throw if reorder count differs from the playlist', () => {
    const playlist = new PlaylistEntries([
      { musicId: 'music-1', position: 0 },
      { musicId: 'music-2', position: 1 },
    ]);
    expect(() =>
      playlist.reorder([{ musicId: 'music-1', position: 0 }]),
    ).toThrow(MusicNotFoundInPlaylistException);
  });
});
