import { Inject, Injectable } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';
import type { DrizzleDB } from 'src/core/database/database';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import { userTable } from 'src/user/infrastructure/persistance/schemas/user.schema';
import { UserWriteRepositoryPort } from 'src/user/domain/port/user-write-repository.port';
import { User } from 'src/user/domain/user.entity';

type UserRecord = InferSelectModel<typeof userTable>;

@Injectable()
export class UserWriteRepository implements UserWriteRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.email,
      record.name,
      record.slug,
      record.isActive,
      record.isAdmin,
    );
  }

  async findById(id: string): Promise<User | null> {
    const [record] = await this.database
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async save(user: User, password?: string): Promise<void> {
    const values: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      slug: user.slug,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };

    if (password) {
      values.password = password;
    }

    await this.database
      .insert(userTable)
      .values(values)
      .onConflictDoUpdate({
        target: userTable.id,
        set: {
          email: user.email,
          name: user.name,
          slug: user.slug,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
        },
      });
  }

  async activate(id: string): Promise<void> {
    await this.database
      .update(userTable)
      .set({ isActive: true })
      .where(eq(userTable.id, id));
  }

  async deactivate(id: string): Promise<void> {
    await this.database
      .update(userTable)
      .set({ isActive: false })
      .where(eq(userTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(userTable).where(eq(userTable.id, id));
  }
}
