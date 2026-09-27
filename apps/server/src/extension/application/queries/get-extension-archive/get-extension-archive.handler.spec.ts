import { Readable } from 'stream';
import { GetExtensionArchiveHandler } from './get-extension-archive.handler';
import { ExtensionArchiveStoragePort } from 'src/extension/application/port/extension-archive-storage.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

describe('GetExtensionArchiveHandler', () => {
  let handler: GetExtensionArchiveHandler;
  let storage: jest.Mocked<ExtensionArchiveStoragePort>;

  beforeEach(() => {
    storage = { getLatest: jest.fn() };
    handler = new GetExtensionArchiveHandler(storage);
  });

  it('should return the latest archive', async () => {
    const archive = { stream: Readable.from(['zip']), size: 3 };
    storage.getLatest.mockResolvedValue(archive);

    await expect(handler.execute()).resolves.toBe(archive);
  });

  it('should propagate a missing archive', async () => {
    storage.getLatest.mockRejectedValue(
      new RessourceNotFoundException('Extension archive'),
    );

    await expect(handler.execute()).rejects.toBeInstanceOf(
      RessourceNotFoundException,
    );
  });
});
