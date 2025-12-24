import { InvalidPositionException } from '../exceptions/invalid-position.exception';
import { MusicAlreadyInPlaylistException } from '../exceptions/music-already-in-playlist.exception';
import { MusicNotFoundInPlaylistException } from '../exceptions/music-not-found-in-playlist.exception';

export type PlaylistEntry = { musicId: string; position: number };

export class PlaylistEntries {
  private entries: PlaylistEntry[];

  constructor(entries: PlaylistEntry[]) {
    this.entries = [...entries].sort((a, b) => a.position - b.position);
  }

  static create() {
    return new PlaylistEntries([]);
  }

  getEntries(): PlaylistEntry[] {
    return this.entries;
  }

  /**
   * Ajoute une musique à une position donnée.
   * Décale les musiques suivantes de +1.
   */
  add(musicId: string, position: number) {
    if (position < 0) {
      throw new InvalidPositionException();
    }

    if (this.entries.some((entry) => entry.musicId === musicId)) {
      throw new MusicAlreadyInPlaylistException();
    }

    this.entries = this.entries.map((entry) => {
      if (entry.position >= position) {
        return { ...entry, position: entry.position + 1 };
      }
      return entry;
    });

    this.entries.push({ musicId, position });
    this.entries.sort((a, b) => a.position - b.position);
  }

  /**
   * Supprime une musique de la playlist.
   * Décale les musiques suivantes de -1 pour combler le vide.
   */
  remove(musicId: string) {
    const entryToRemove = this.entries.find((e) => e.musicId === musicId);
    if (!entryToRemove) {
      throw new MusicNotFoundInPlaylistException();
    }

    const removedPosition = entryToRemove.position;
    this.entries = this.entries
      .filter((e) => e.musicId !== musicId)
      .map((e) => {
        if (e.position > removedPosition) {
          return { ...e, position: e.position - 1 };
        }
        return e;
      });
  }

  /**
   * Déplace une musique vers une nouvelle position.
   */
  move(musicId: string, newPosition: number) {
    const entryToMove = this.entries.find((e) => e.musicId === musicId);
    if (!entryToMove) {
      throw new MusicNotFoundInPlaylistException();
    }

    this.remove(musicId);
    this.add(musicId, newPosition);
  }
}
