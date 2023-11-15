import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ErrorHelper } from 'src/helpers';
import { USER_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { IPagination } from 'src/interfaces/response.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { confirmPassword, ...payload } = createUserDto;
    const existedUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (existedUser) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.EMAIL_EXISTED),
      );
    }
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

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
    });
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    return user;
  }

  async deleteUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async getUsers(query: GetUsersDto): Promise<IPagination<User>> {
    const { limit, offset, startingId, status } = query;
    const searchQuery = {};
    if (status) {
      searchQuery['status'] = status;
    }
    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: limit,
        skip: offset,
        cursor: {
          id: startingId ?? 1,
        },
        where: {
          ...searchQuery,
        },
      }),
    ]);

    return {
      total,
      items,
    };
  }
}
