import { PlaylistEntity } from './playlist.entity';
import { Visibility } from './values-object/visibility.value-object';
import { PlaylistEntries } from './values-object/playlist-entries.value-object';

describe('PlaylistEntity', () => {
  const userId = 'user-1';
  const musicId = 'music-1';

  it('should create a playlist entity', () => {
    const playlist = PlaylistEntity.create(
      'My Playlist',
      'Description',
      userId,
      Visibility.public,
    );

    expect(playlist.getId()).toBeDefined();
    expect(playlist.getTitle()).toBe('My Playlist');
    expect(playlist.getDescription()).toBe('Description');
    expect(playlist.getUserId()).toBe(userId);
    expect(playlist.getVisibility()).toBe(Visibility.public);
    expect(playlist.getPlaylistEntries()).toBeInstanceOf(PlaylistEntries);
  });

  it('should check if a user can access the playlist', () => {
    const publicPlaylist = PlaylistEntity.create(
      'Public',
      '',
      userId,
      Visibility.public,
    );
    const privatePlaylist = PlaylistEntity.create(
      'Private',
      '',
      userId,
      Visibility.private,
    );

    expect(publicPlaylist.canBeAccessedBy('other-user')).toBe(true);
    expect(privatePlaylist.canBeAccessedBy(userId)).toBe(true);
    expect(privatePlaylist.canBeAccessedBy('other-user')).toBe(false);
  });

  it('should check if a user can modify the playlist', () => {
    const playlist = PlaylistEntity.create('My Playlist', '', userId);

    expect(playlist.canBeModifiedBy(userId)).toBe(true);
    expect(playlist.canBeModifiedBy('other-user')).toBe(false);
  });

  it('should add and remove music', () => {
    const playlist = PlaylistEntity.create('My Playlist', '', userId);

    playlist.addMusic(musicId, 0);
    expect(playlist.getPlaylistEntries().getEntries()).toHaveLength(1);
    expect(playlist.getPlaylistEntries().getEntries()[0].musicId).toBe(musicId);

    playlist.removeMusic(musicId);
    expect(playlist.getPlaylistEntries().getEntries()).toHaveLength(0);
  });

  it('should update title, description and visibility', () => {
    const playlist = PlaylistEntity.create('Old Title', 'Old Desc', userId);

    playlist.setTitle('New Title');
    playlist.setDescription('New Desc');
    playlist.setVisibility(Visibility.public);

    expect(playlist.getTitle()).toBe('New Title');
    expect(playlist.getDescription()).toBe('New Desc');
    expect(playlist.getVisibility()).toBe(Visibility.public);
  });
});
