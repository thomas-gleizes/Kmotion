import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginBodyDto } from 'src/auth/presentation/dto/input/login-body.dto';
import { RegisterBodyDto } from 'src/auth/presentation/dto/input/register-body.dto';
import { LoginCommand } from 'src/auth/application/commands/login/login.command';
import { RegisterCommand } from 'src/auth/application/commands/register/register.command';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Return access token' })
  @ApiOkResponse({ type: String, description: 'Access token' })
  async login(@Body() body: LoginBodyDto) {
    const accessToken: string = await this.commandBus.execute(
      new LoginCommand(body.email, body.password),
    );

    return accessToken;
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Return access token',
  })
  @ApiOkResponse({ type: String, description: 'Access token' })
  async register(@Body() body: RegisterBodyDto) {
    const acessToken: string = await this.commandBus.execute(
      new RegisterCommand(body.email, body.name, body.password),
    );

    return acessToken;
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
