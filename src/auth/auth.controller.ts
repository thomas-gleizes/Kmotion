import { Body, Controller, Get, HttpCode, Post, UseGuards, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { AdminGuard } from './guard';
import { AllowAny, GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAny()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return { success: true, ...(await this.authService.signIn(body)) };
  }

  @AllowAny()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDto) {
    return { success: true, ...(await this.authService.signUp(body)) };
  }

  @Get('me')
  async me(@GetUser() user) {
    return { success: true, user };
  }

  @UseGuards(AdminGuard)
  @Get('is-admin')
  async isAdmin(@GetUser() user) {
    return { success: true, user };
  }
}
