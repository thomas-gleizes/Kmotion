import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { PreviewMediaQuery } from 'src/music/application/queries/preview-media/preview-media.query';
import {
  CONVERTER_SERVICE_PORT,
  type ConverterServicePort,
  type MediaPreview,
} from 'src/music/domain/port/converter-service.port';

/** Details of a media before converting it, asked to the converter. */
@QueryHandler(PreviewMediaQuery)
export class PreviewMediaHandler implements IQueryHandler<PreviewMediaQuery> {
  constructor(
    @Inject(CONVERTER_SERVICE_PORT)
    private readonly converterService: ConverterServicePort,
  ) {}

  execute({ payload }: PreviewMediaQuery): Promise<MediaPreview> {
    return this.converterService.previewMedia(
      payload.mediaId,
      payload.mediaSource,
      payload.clip,
    );
  }
}
