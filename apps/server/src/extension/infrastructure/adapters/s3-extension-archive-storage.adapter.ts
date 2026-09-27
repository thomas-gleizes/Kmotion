import { Injectable } from '@nestjs/common';
import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { environment } from 'src/core/config/environment';
import {
  ExtensionArchive,
  ExtensionArchiveStoragePort,
} from 'src/extension/application/port/extension-archive-storage.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

/** Reads the archive the CI uploads to MinIO under a fixed key. */
@Injectable()
export class S3ExtensionArchiveStorageAdapter implements ExtensionArchiveStoragePort {
  private readonly client = new S3Client({
    endpoint: environment.S3_ENDPOINT,
    region: environment.S3_REGION,
    // MinIO serves buckets as paths, not subdomains.
    forcePathStyle: true,
    credentials: {
      accessKeyId: environment.S3_ACCESS_KEY,
      secretAccessKey: environment.S3_SECRET_KEY,
    },
  });

  async getLatest(): Promise<ExtensionArchive> {
    try {
      const object = await this.client.send(
        new GetObjectCommand({
          Bucket: environment.EXTENSION_BUCKET,
          Key: environment.EXTENSION_OBJECT_KEY,
        }),
      );

      return {
        stream: object.Body as Readable,
        size: object.ContentLength,
      };
    } catch (error) {
      if (error instanceof NoSuchKey) {
        throw new RessourceNotFoundException('Extension archive');
      }
      throw error;
    }
  }
}
