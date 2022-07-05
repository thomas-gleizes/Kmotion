import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { UpdateUserDto } from './user.dto';
import { AuthGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async find(@Param('id', ParseIntPipe) bookmarkId: number) {
    const user = await this.userService.findById(bookmarkId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { success: true, user };
  }

  @UseGuards(AuthGuard)
  @Patch('/')
  async update(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(userId, dto);

    return { success: true, user };
  }
}
