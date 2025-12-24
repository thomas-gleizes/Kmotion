import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import {
  PlaylistEntries,
  PlaylistEntry,
} from 'src/playlist/domain/values-object/playlist-entries.value-object';
import { randomUUID } from 'crypto';

export class PlaylistEntity {
  private readonly _id: string;
  private _title: string;
  private _description: string;
  private readonly _userId: string;
  private _visibility: Visibility;
  private readonly _entries: PlaylistEntries;

  constructor(
    id: string,
    title: string,
    description: string,
    userId: string = '',
    visibility: Visibility,
    entries: PlaylistEntries,
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._userId = userId;
    this._visibility = visibility;
    this._entries = entries;
  }

  static create(
    title: string,
    description: string,
    userId: string,
    visibility: Visibility = Visibility.private,
    entries: PlaylistEntry[] = [],
  ) {
    return new PlaylistEntity(
      randomUUID(),
      title,
      description,
      userId,
      visibility,
      new PlaylistEntries(entries),
    );
  }

  getPlaylistEntries(): PlaylistEntries {
    return this._entries;
  }

  addMusic(musicId: string, position: number) {
    this._entries.add(musicId, position);
  }

  removeMusic(musicId: string) {
    this._entries.remove(musicId);
  }

  getId(): string {
    return this._id;
  }

  canBeAccessedBy(userId: string): boolean {
    return this._visibility === Visibility.public || this._userId === userId;
  }

  canBeModifiedBy(userId: string): boolean {
    return this._userId === userId;
  }

  getTitle(): string {
    return this._title;
  }

  setTitle(title: string) {
    this._title = title;
  }

  getDescription(): string {
    return this._description;
  }

  setDescription(description: string) {
    this._description = description;
  }

  getVisibility(): Visibility {
    return this._visibility;
  }

  setVisibility(visibility: Visibility) {
    this._visibility = visibility;
  }

  getUserId(): string {
    return this._userId;
  }
}
