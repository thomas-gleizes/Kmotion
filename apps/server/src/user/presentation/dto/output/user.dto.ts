import { User } from 'src/user/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRead } from 'src/user/application/port/user-query-repository.port';

export class UserDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({ type: 'string', example: 'John Doe' })
  name: string;

  @ApiProperty({ type: 'string', example: 'john-doe' })
  slug: string;

  @ApiProperty({ type: 'boolean', example: true })
  isActive: boolean;

  @ApiProperty({ type: 'boolean', example: false })
  isAdmin: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  lastActivityAt: string | null;

  static fromDomain(user: User) {
    return UserDto.fromRead(user);
  }

  static fromRead(user: User | UserRead) {
    const dto = new UserDto();

    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.slug = user.slug;
    dto.isActive = user.isActive;
    dto.isAdmin = user.isAdmin;
    dto.createdAt = user.createdAt.toISOString();
    dto.lastActivityAt = user.lastActivityAt
      ? user.lastActivityAt.toISOString()
      : null;

    return dto;
  }
}
