import { Type } from '@nestjs/common';
import { IQueryHandler } from 'src/core/cqrs';
import { GetExtensionArchiveHandler } from 'src/extension/application/queries/get-extension-archive/get-extension-archive.handler';

export const extensionQueryHandlers: Type<IQueryHandler<any>>[] = [
  GetExtensionArchiveHandler,
];
