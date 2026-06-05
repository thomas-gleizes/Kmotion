import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns API status' })
  @ApiOkResponse({ description: 'API is up and running' })
  check() {
    return { status: 'ok' };
  }
}
