import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/application/auth.service';
import { LoginBodyDto } from 'src/auth/presentation/dto/input/login-body.dto';
import { RegisterBodyDto } from 'src/auth/presentation/dto/input/register-body.dto';
import { UserDto } from 'src/user/presentation/dto/output/user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Return access token' })
  @ApiOkResponse({ type: String, description: 'Access token' })
  async login(@Body() body: LoginBodyDto) {
    const result = await this.authService.signIn(
      body.email.toLowerCase(),
      body.password,
    );

    return {
      user: UserDto.fromDomain(result.user),
      token: result.token,
    };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Return access token',
  })
  @ApiOkResponse({ type: String, description: 'Access token' })
  async register(@Body() body: RegisterBodyDto) {
    const result = await this.authService.register(
      body.email.toLowerCase(),
      body.name,
      body.password,
    );

    return {
      user: UserDto.fromDomain(result.user),
      token: result.token,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate access token',
  })
  @ApiNoContentResponse({ description: 'User logged out successfully' })
  logout() {}
}
