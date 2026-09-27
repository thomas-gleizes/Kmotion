import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ExtensionController } from 'src/extension/presentation/extension.controller';
import { extensionQueryHandlers } from 'src/extension/application/queries';
import { EXTENSION_ARCHIVE_STORAGE_PORT } from 'src/extension/application/port/extension-archive-storage.port';
import { S3ExtensionArchiveStorageAdapter } from 'src/extension/infrastructure/adapters/s3-extension-archive-storage.adapter';

@Module({
  imports: [AuthModule],
  controllers: [ExtensionController],
  providers: [
    {
      provide: EXTENSION_ARCHIVE_STORAGE_PORT,
      useClass: S3ExtensionArchiveStorageAdapter,
    },
    ...extensionQueryHandlers,
  ],
})
export class ExtensionModule {}
