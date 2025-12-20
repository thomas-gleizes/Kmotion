import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { DrizzleDB } from 'src/core/database/database';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import { usersTable } from 'src/user/infrastructure/persistance/schemas/user.schema';
import { UserRepositoryPort } from 'src/user/domain/port/user-repository.port';
import { User } from 'src/user/domain/user.entity';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleDB) {}

  private mapToDomain(record: any): User {
    return new User(
      record.id,
      record.email,
      record.name,
      record.slug,
      record.isActive,
      record.isAdmin,
    );
  }

  async findByEmail(email: string): Promise<User> {
    const record = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return this.mapToDomain(record);
  }

  async findById(id: string): Promise<User | null> {
    const [record] = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async findBySlug(slug: string): Promise<User | null> {
    const [record] = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.slug, slug));

    if (!record) return null;

    return this.mapToDomain(record);
  }

  async save(user: User, hashedPassword: string): Promise<void> {
    await this.database.insert(usersTable).values({
      id: user.id,
      email: user.email,
      password: hashedPassword,
      name: user.name,
      slug: user.slug,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    });
  }

  activate(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  deactivate(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
