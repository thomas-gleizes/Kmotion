import { PgDialect } from 'drizzle-orm/pg-core';
import { isListable } from 'src/music/infrastructure/persistance/repository/music-query.repository';

describe('MusicReadRepository listing filter', () => {
  it('only lists converted musics', () => {
    const query = new PgDialect().sqlToQuery(isListable);

    expect(query.sql).toBe('"musics"."conversion_status" = $1');
    expect(query.params).toEqual(['ready']);
  });
});
