import { Inject, Injectable } from '@nestjs/common';
import { count, eq, InferSelectModel } from 'drizzle-orm';
import type { DrizzleDB } from 'src/core/database/database';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';
import {
  PaginatedUsers,
  UserQueryRepositoryPort,
  UserRead,
} from 'src/user/application/port/user-query-repository.port';

type UserRecord = InferSelectModel<typeof userTable>;

@Injectable()
export class UserQueryRepository implements UserQueryRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToRead(record: UserRecord): UserRead {
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      slug: record.slug,
      isActive: record.isActive,
      isAdmin: record.isAdmin,
    };
  }

  async findByEmail(email: string): Promise<UserRead | null> {
    const [record] = await this.database
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!record) return null;

    return this.mapToRead(record);
  }

  async findById(id: string): Promise<UserRead | null> {
    const [record] = await this.database
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!record) return null;

    return this.mapToRead(record);
  }

  async findBySlug(slug: string): Promise<UserRead | null> {
    const [record] = await this.database
      .select()
      .from(userTable)
      .where(eq(userTable.slug, slug));

    if (!record) return null;

    return this.mapToRead(record);
  }

  async findAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<PaginatedUsers> {
    const records = await this.database
      .select()
      .from(userTable)
      .limit(size)
      .offset(page * size);

    const [{ total }] = await this.database
      .select({ total: count() })
      .from(userTable);

    return { records: records.map((record) => this.mapToRead(record)), total };
  }
}
