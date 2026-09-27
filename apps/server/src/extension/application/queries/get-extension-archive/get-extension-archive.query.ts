import { Query } from 'src/core/cqrs';
import type { ExtensionArchive } from 'src/extension/application/port/extension-archive-storage.port';

export class GetExtensionArchiveQuery extends Query<ExtensionArchive> {}
