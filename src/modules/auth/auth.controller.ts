import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AUTH_MESSAGE } from 'src/messages/auth.message';
import { LocalesService } from '../locales/locales.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ILogin } from 'src/interfaces/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localesService: LocalesService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    message: string;
    data: ILogin;
  }> {
    return {
      message: this.localesService.translate(AUTH_MESSAGE.LOGIN_SUCCESS),
      data: await this.authService.login(loginDto),
    };
  }
}
