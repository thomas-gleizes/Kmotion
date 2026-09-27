import type { Readable } from 'stream';

export type ExtensionArchive = {
  stream: Readable;
  size?: number;
};

export const EXTENSION_ARCHIVE_STORAGE_PORT = Symbol(
  'EXTENSION_ARCHIVE_STORAGE_PORT',
);

export interface ExtensionArchiveStoragePort {
  /** The latest packaged extension; throws RessourceNotFoundException if none was uploaded. */
  getLatest(): Promise<ExtensionArchive>;
}
