import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ErrorHelper } from 'src/helpers';
import { AUTH_MESSAGE } from 'src/messages/auth.message';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { ILogin } from 'src/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly localesService: LocalesService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILogin> {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({
      email,
    });
    if (!user) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.LOGIN_FAIL),
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.LOGIN_FAIL),
      );
    }
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
