import {
  Controller,
  Get,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import type { Response as ExpressResponse } from 'express';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { GetExtensionArchiveQuery } from 'src/extension/application/queries/get-extension-archive/get-extension-archive.query';

@Controller('extension')
@ApiTags('Extension')
export class ExtensionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('download')
  @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'downloadExtension',
    summary: 'Download the packaged browser extension',
  })
  @ApiProduces('application/zip')
  @ApiOkResponse({
    description: 'Browser extension archive',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async download(@Response({ passthrough: true }) res: ExpressResponse) {
    const archive = await this.queryBus.execute(new GetExtensionArchiveQuery());

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="kmotion-extension.zip"',
      // Replaced on every deployment under the same key: always revalidate.
      'Cache-Control': 'no-cache',
      ...(archive.size !== undefined && {
        'Content-Length': String(archive.size),
      }),
    });

    return new StreamableFile(archive.stream);
  }
}
