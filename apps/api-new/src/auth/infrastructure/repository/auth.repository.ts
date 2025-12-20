import { User } from 'src/user/domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/core/database/drizzle.provider';
import type { DrizzleDB } from 'src/core/database/database';
import { usersTable } from 'src/user/infrastructure/persistance/schemas/user.schema';
import { eq } from 'drizzle-orm';
import { AuthRepositoryPort } from 'src/auth/domain/port/auth-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@Injectable()
export class AuthRepository implements AuthRepositoryPort {
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

  async findByEmail(email: string): Promise<[User, string]> {
    const [result] = await this.database
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (result === undefined) throw new DomainException("User doesn't exist");

    return [this.mapToDomain(result), result.password];
  }

  async save(user: User, hash: string) {
    await this.database.insert(usersTable).values({
      id: user.id,
      email: user.email,
      password: hash,
      name: user.name,
      slug: user.slug,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    });
  }
}
