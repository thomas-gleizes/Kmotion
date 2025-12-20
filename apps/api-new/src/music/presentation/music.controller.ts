import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('musics')
@ApiTags('Music')
export class MusicController {
  @Get()
  @ApiOperation({ summary: 'Get all music' })
  index() {
    return [];
  }
}
