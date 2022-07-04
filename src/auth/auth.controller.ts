import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    const user = await this.authService.signIn(body);

    return { success: true, user };
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);

    return { success: true, user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    return { success: true, user: req.user };
  }
}
