import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { AUTH_MESSAGE } from 'src/messages/auth.message';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly localesService: LocalesService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({
      email,
      password,
    });
    if (!user) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.LOGIN_FAIL),
      );
    }
    return user;
  }
}
