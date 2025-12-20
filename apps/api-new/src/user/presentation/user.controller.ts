import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetProfileQuery } from 'src/user/application/queries/get-profile/get-profile.query';
import { FindUserBySlugQuery } from 'src/user/application/queries/find-user-by-slug/find-user-by-slug.query';
import { FindUserByIdQuery } from 'src/user/application/queries/find-user-by-id/find-user-by-id.query';
import { FindUsersQuery } from 'src/user/application/queries/find-users/find-users.query';
import { UserDto } from 'src/user/presentation/dto/output/user.dto';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { PaginatedUsersDto } from 'src/user/presentation/dto/output/paginated-users.dto';
import { UsersIndexBodyDto } from 'src/user/presentation/dto/input/users-index-body.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'index', summary: 'Get all users' })
  @ApiOkResponse({
    type: PaginatedUsersDto,
    description: 'All users',
  })
  async index(@Query() query: UsersIndexBodyDto) {
    return this.queryBus.execute(
      new FindUsersQuery(query.pageSize, query.pageToken, query.filters),
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'profile', summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async profile(@Request() request) {
    const user = await this.queryBus.execute(
      new GetProfileQuery(request.user.sub),
    );

    return UserDto.fromDomain(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'show', summary: 'Find user by id' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async show(@Param('id') id: string) {
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  @Get('/slug/:slug')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'showBySlug', summary: 'Find user by slug' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async showBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new FindUserBySlugQuery(slug));
  }
}
