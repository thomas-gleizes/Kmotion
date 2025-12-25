process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
process.env.JWT_SECRET = 'secret';
process.env.CONVERTER_URL = 'http://localhost:3001';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { Global, Module } from '@nestjs/common';
import { AUTH_SERVICE_PORT } from 'src/auth/application/port/auth-service.port';

@Global()
@Module({
  providers: [{ provide: AUTH_SERVICE_PORT, useValue: {} }],
  exports: [AUTH_SERVICE_PORT],
})
class MockAuthModule {}

import { PLAYLIST_WRITE_REPOSITORY } from 'src/playlist/domain/port/playlist-write-repository.port';
import { PLAYLIST_READ_REPOSITORY_PORT } from 'src/playlist/application/port/playlist-query-repository.port';
import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalExceptionFilters } from 'src/shared/presentation/exception-filters/global-exception.filter';

describe('PlaylistController (e2e)', () => {
  let app: INestApplication;
  const mockPlaylistWriteRepository = {
    save: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
  };
  const mockPlaylistReadRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findMany: jest.fn(),
  };

  const mockUser = { sub: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), PlaylistModule, MockAuthModule],
    })
      .overrideModule(AuthModule)
      .useModule(MockAuthModule)
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;
          return true;
        },
      })
      .overrideProvider(PLAYLIST_WRITE_REPOSITORY)
      .useValue(mockPlaylistWriteRepository)
      .overrideProvider(PLAYLIST_READ_REPOSITORY_PORT)
      .useValue(mockPlaylistReadRepository)
      .overrideProvider(DRIZZLE)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilters());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /playlists', () => {
    it('should return a list of playlists', () => {
      mockPlaylistReadRepository.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/playlists')
        .expect(200)
        .expect([]);
    });
  });

  describe('POST /playlists', () => {
    it('should create a playlist', () => {
      mockPlaylistWriteRepository.save.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .post('/playlists')
        .send({
          title: 'My New Playlist',
          description: 'A description',
          visibility: Visibility.public,
        })
        .expect(201);
    });
  });

  describe('GET /playlists/:id', () => {
    it('should return a playlist by id', () => {
      const playlist = {
        id: 'playlist-1',
        title: 'Title',
        description: 'Desc',
        visibility: Visibility.public,
        user: { id: 'user-1', name: 'User', slug: 'user' },
        entries: [],
      };
      mockPlaylistReadRepository.findById.mockResolvedValue(playlist);

      return request(app.getHttpServer())
        .get('/playlists/playlist-1')
        .expect(200)
        .expect(playlist);
    });

    it('should return 404 if playlist not found', () => {
      mockPlaylistReadRepository.findById.mockResolvedValue(null);

      return request(app.getHttpServer()).get('/playlists/unknown').expect(404);
    });
  });

  describe('PATCH /playlists/:id', () => {
    it('should update a playlist', () => {
      const { PlaylistEntity } = require('src/playlist/domain/playlist.entity');
      const playlistEntity = PlaylistEntity.create('Old', 'Old', 'user-1');
      mockPlaylistWriteRepository.findById.mockResolvedValue(playlistEntity);
      mockPlaylistWriteRepository.save.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .patch(`/playlists/${playlistEntity.getId()}`)
        .send({ title: 'New Title' })
        .expect(200);
    });

    it('should return 400 if user is not owner', () => {
      const { PlaylistEntity } = require('src/playlist/domain/playlist.entity');
      const playlistEntity = PlaylistEntity.create('Old', 'Old', 'other-user');
      mockPlaylistWriteRepository.findById.mockResolvedValue(playlistEntity);

      return request(app.getHttpServer())
        .patch(`/playlists/${playlistEntity.getId()}`)
        .send({ title: 'New Title' })
        .expect(400);
    });
  });

  describe('DELETE /playlists/:id', () => {
    it('should delete a playlist', () => {
      const { PlaylistEntity } = require('src/playlist/domain/playlist.entity');
      const playlistEntity = PlaylistEntity.create('To delete', '', 'user-1');
      mockPlaylistWriteRepository.findById.mockResolvedValue(playlistEntity);
      mockPlaylistWriteRepository.delete.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/playlists/${playlistEntity.getId()}`)
        .expect(200);
    });
  });

  describe('POST /playlists/:id/musics', () => {
    it('should add music to playlist', () => {
      const { PlaylistEntity } = require('src/playlist/domain/playlist.entity');
      const playlistEntity = PlaylistEntity.create('Title', '', 'user-1');
      mockPlaylistWriteRepository.findById.mockResolvedValue(playlistEntity);
      mockPlaylistWriteRepository.save.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .post(`/playlists/${playlistEntity.getId()}/musics`)
        .send({ musicId: 'music-1', position: 0 })
        .expect(201);
    });
  });

  describe('DELETE /playlists/:id/musics/:musicId', () => {
    it('should remove music from playlist', () => {
      const { PlaylistEntity } = require('src/playlist/domain/playlist.entity');
      const playlistEntity = PlaylistEntity.create(
        'Title',
        '',
        'user-1',
        Visibility.public,
        [{ musicId: 'music-1', position: 0 }],
      );
      mockPlaylistWriteRepository.findById.mockResolvedValue(playlistEntity);
      mockPlaylistWriteRepository.save.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete(`/playlists/${playlistEntity.getId()}/musics/music-1`)
        .expect(200);
    });
  });
});
