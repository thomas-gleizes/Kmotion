import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginBodyDto } from 'src/auth/presentation/dto/input/login-body.dto';
import { RegisterBodyDto } from 'src/auth/presentation/dto/input/register-body.dto';
import { LoginCommand } from 'src/auth/application/commands/login/login.command';
import { RegisterCommand } from 'src/auth/application/commands/register/register.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Return access token' })
  @ApiOkResponse({ type: String, description: 'Access token' })
  async login(@Body() body: LoginBodyDto) {
    return await this.commandBus.execute(
      new LoginCommand({
        email: body.email,
        password: body.password,
      }),
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create an inactive account, awaiting admin activation',
  })
  @ApiCreatedResponse({
    description: 'User created, awaiting admin activation',
  })
  async register(@Body() body: RegisterBodyDto) {
    await this.commandBus.execute(
      new RegisterCommand({
        email: body.email,
        name: body.name,
        password: body.password,
      }),
    );
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Invalidate access token',
  })
  @ApiNoContentResponse({ description: 'User logged out successfully' })
  logout() {
    throw new NotImplementedException();
  }
}
