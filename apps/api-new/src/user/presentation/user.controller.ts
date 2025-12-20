import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProfileCase } from 'src/user/application/use-cases/get-profile.case';
import { UserDto } from 'src/user/presentation/dto/output/user.dto';
import { AuthGuard } from 'src/shared/presentation/guards/auth.guard';
import { FindUserByIdCase } from 'src/user/application/use-cases/find-user-by-id.case';
import { FindUserBySlugCase } from 'src/user/application/use-cases/find-user-by-slug.case';
import { PaginateResponseDto } from 'src/shared/presentation/dto/paginate-response.dto';
import { PaginatedUsersDto } from 'src/user/presentation/dto/output/paginated-users.dto';
import { UsersIndexBodyDto } from 'src/user/presentation/dto/input/users-index-body.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly getProfileCase: GetProfileCase,
    private readonly findByIdCase: FindUserByIdCase,
    private readonly findBySlugCase: FindUserBySlugCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'index', summary: 'Get all users' })
  @ApiOkResponse({
    type: PaginatedUsersDto,
    description: 'All users',
  })
  async index(@Query() query: UsersIndexBodyDto) {
    return {
      records: [],
      nextPage: null,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'show', summary: 'Find user by id' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async show(@Param('id') id: string) {
    return this.findByIdCase.execute({ id });
  }

  @Get('/slug/:slug')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'showBySlug', summary: 'Find user by slug' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async showBySlug(@Param('slug') slug: string) {
    return this.findBySlugCase.execute({ slug });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'profile', summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserDto, description: 'User profile' })
  async profile(@Request() request) {
    const user = await this.getProfileCase.execute({ id: request.user.sub });

    return UserDto.fromDomain(user);
  }
}
