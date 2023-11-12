import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { ErrorHelper } from 'src/helpers';
import { USER_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { confirmPassword, ...payload } = createUserDto;
    if (confirmPassword !== payload.password) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PASSWORD_NOT_MATCH),
      );
    }
    const user = await this.prisma.user.create({
      data: payload,
    });
    return user;
  }

  async getUsers(): Promise<any> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
