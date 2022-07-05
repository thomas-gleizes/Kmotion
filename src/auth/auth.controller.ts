import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { AdminGuard, AuthGuard } from './guard';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return { success: true, ...(await this.authService.signIn(body)) };
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return { success: true, ...(await this.authService.signUp(body)) };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@GetUser() user) {
    return { success: true, user };
  }
}
