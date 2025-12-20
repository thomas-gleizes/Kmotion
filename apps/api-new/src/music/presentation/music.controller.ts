import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('musics')
@ApiTags('Music')
export class MusicController {
  @Get()
  @ApiOperation({ summary: 'Get all music' })
  index() {
    return [];
  }

  @Post('/sync')
  @ApiOperation({
    operationId: 'sync',
    summary: 'Sync music with converter service',
  })
  @ApiOkResponse({ description: 'Sync music' })
  async sync() {}

  @Post('/media')
  @ApiOperation({
    operationId: 'addMedia',
    summary: 'Add media',
    description: 'Add media to database and convert it by source and id',
  })
  @ApiOkResponse({ description: 'Added media', type: String })
  async addMedia() {}

  @Get(':id')
  @ApiOperation({ operationId: 'show', summary: 'Get music by id' })
  @ApiOkResponse({ type: String, description: 'Music' })
  async show(@Param('id') id: string) {
    return id;
  }

  @Get(':id/audio')
  @ApiOperation({ operationId: 'getAudio', summary: 'Get music audio' })
  @ApiOkResponse({ type: String, description: 'Music audio' })
  async getAudio(@Param('id') id: string) {
    return id;
  }

  @Get(':id/thumbnail')
  @ApiOperation({
    operationId: 'getThumbnail',
    summary: 'Get music thumbnail',
  })
  @ApiOkResponse({ type: String, description: 'Music thumbnail' })
  async getThumbnail(@Param('id') id: string) {
    return id;
  }

  @Get('/media/:id')
  @ApiOperation({
    operationId: 'showByMediaId',
    summary: 'Find music by media id',
  })
  @ApiOkResponse({ type: String, description: 'Music' })
  async showByMediaId(@Param('id') id: string) {
    return id;
  }

  @Get('/search')
  @ApiOperation({ operationId: 'search', summary: 'Search music' })
  @ApiOkResponse({ type: [String], description: 'Music' })
  async search() {}
}
