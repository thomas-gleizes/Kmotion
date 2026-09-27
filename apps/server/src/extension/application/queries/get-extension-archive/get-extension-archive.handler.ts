import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { GetExtensionArchiveQuery } from 'src/extension/application/queries/get-extension-archive/get-extension-archive.query';
import {
  EXTENSION_ARCHIVE_STORAGE_PORT,
  type ExtensionArchive,
  type ExtensionArchiveStoragePort,
} from 'src/extension/application/port/extension-archive-storage.port';

/** The packaged browser extension, as uploaded to the object storage by the CI. */
@QueryHandler(GetExtensionArchiveQuery)
export class GetExtensionArchiveHandler implements IQueryHandler<GetExtensionArchiveQuery> {
  constructor(
    @Inject(EXTENSION_ARCHIVE_STORAGE_PORT)
    private readonly storage: ExtensionArchiveStoragePort,
  ) {}

  execute(): Promise<ExtensionArchive> {
    return this.storage.getLatest();
  }
}
