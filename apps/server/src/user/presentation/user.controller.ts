import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetProfileQuery } from 'src/user/application/queries/get-profile/get-profile.query';
import { FindUserBySlugQuery } from 'src/user/application/queries/find-user-by-slug/find-user-by-slug.query';
import { FindUserByIdQuery } from 'src/user/application/queries/find-user-by-id/find-user-by-id.query';
import { FindUsersQuery } from 'src/user/application/queries/find-users/find-users.query';
import { BanUserCommand } from 'src/user/application/commands/ban-user/ban-user.command';
import { UnbanUserCommand } from 'src/user/application/commands/unban-user/unban-user.command';
import { DeleteUserCommand } from 'src/user/application/commands/delete-user/delete-user.command';
import { UserDto } from 'src/user/presentation/dto/output/user.dto';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { AdminGuard } from 'src/shared/presentation/guards/admin.guard';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { type AuthPayload } from 'src/auth/application/port/auth-service.port';
import { PaginatedUsersDto } from 'src/user/presentation/dto/output/paginated-users.dto';
import { UsersPaginationDto } from 'src/user/presentation/dto/input/users-pagination.dto';
import { PaginatedUsers } from 'src/user/application/port/user-query-repository.port';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'users_index',
    summary: 'Get all users (admin only)',
  })
  @ApiOkResponse({ type: PaginatedUsersDto, description: 'All users' })
  async index(
    @Query() pagination: UsersPaginationDto,
  ): Promise<PaginatedUsersDto> {
    const result: PaginatedUsers = await this.queryBus.execute(
      new FindUsersQuery({
        page: pagination.page ?? 0,
        size: pagination.size ?? 20,
      }),
    );

    return {
      records: result.records.map((user) => UserDto.fromRead(user)),
      total: result.total,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'profile', summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async profile(@Request() request) {
    const user = await this.queryBus.execute(
      new GetProfileQuery({ id: request.user.sub }),
    );

    return UserDto.fromDomain(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'users_show', summary: 'Find user by id' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async show(@Param('id') id: string) {
    return this.queryBus.execute(new FindUserByIdQuery({ id }));
  }

  @Get('/slug/:slug')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'showBySlug', summary: 'Find user by slug' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async showBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new FindUserBySlugQuery({ slug }));
  }

  @Post(':id/ban')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ operationId: 'banUser', summary: 'Ban a user (admin only)' })
  @ApiOkResponse({ description: 'User banned' })
  async ban(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    await this.commandBus.execute(
      new BanUserCommand({ userId: id, currentUserId: user.sub }),
    );
  }

  @Post(':id/unban')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'unbanUser',
    summary: 'Unban a user (admin only)',
  })
  @ApiOkResponse({ description: 'User unbanned' })
  async unban(@Param('id') id: string) {
    await this.commandBus.execute(new UnbanUserCommand({ userId: id }));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    operationId: 'deleteUser',
    summary: 'Delete a user (admin only)',
  })
  @ApiOkResponse({ description: 'User deleted' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthPayload) {
    await this.commandBus.execute(
      new DeleteUserCommand({ userId: id, currentUserId: user.sub }),
    );
  }
}
