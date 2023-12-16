import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EUserRole } from 'src/common/enums';
import {
  LIMIT_DEFAULT,
  MAIL_SUBJECT,
  MAIL_TEMPLATE,
  PAGE_DEFAULT,
  SALT_ROUNDS,
} from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import {
  LEVEL_MESSAGE,
  POSITION_MESSAGE,
  UNIVERSITY_MESSAGE,
  USER_MESSAGE,
} from 'src/messages';
import { LevelsService } from '../levels/levels.service';
import { LocalesService } from '../locales/locales.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { PositionsService } from '../positions/positions.service';
import { PrismaService } from '../prisma/prisma.service';
import { UniversitiesService } from '../universities/universities.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
    private readonly nodemailerService: NodemailerService,
    private readonly positionsService: PositionsService,
    private readonly universitiesService: UniversitiesService,
    private readonly levelsService: LevelsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { confirmPassword, ...payload } = createUserDto;
    const role = await this.prisma.role.findUnique({
      where: {
        name: EUserRole.USER,
      },
    });
    if (!role) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.CREATE_USER_FAIL),
      );
    }
    const existedUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: payload.email,
          },
          {
            phone: payload.phone,
          },
        ],
      },
    });
    if (existedUser && existedUser.email === payload.email) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.EMAIL_EXISTED),
      );
    }
    if (existedUser && existedUser.phone === payload.phone) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PHONE_EXISTED),
      );
    }
    if (confirmPassword !== payload.password) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PASSWORD_NOT_MATCH),
      );
    }
    if (createUserDto.levelId) {
      const level = await this.levelsService.findOne({
        where: {
          id: createUserDto.levelId,
        },
      });
      if (!level) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(LEVEL_MESSAGE.LEVEL_NOT_FOUND),
        );
      }
    }
    if (createUserDto.positionId) {
      const position = await this.positionsService.findOne({
        where: {
          id: createUserDto.positionId,
        },
      });
      if (!position) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
        );
      }
    }
    if (createUserDto.universityId) {
      const university = await this.universitiesService.findOne({
        where: {
          id: createUserDto.universityId,
        },
      });
      if (!university) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(
            UNIVERSITY_MESSAGE.UNIVERSITY_NOT_FOUND,
          ),
        );
      }
    }
    const hashPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        password: hashPassword,
        roleId: role.id,
      },
    });
    return user;
  }

  async createStaff(createUserDto: CreateUserDto): Promise<User> {
    const { confirmPassword, ...payload } = createUserDto;
    const role = await this.prisma.role.findUnique({
      where: {
        name: EUserRole.STAFF,
      },
    });
    if (!role) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.CREATE_USER_FAIL),
      );
    }
    const existedUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: payload.email,
          },
          {
            phone: payload.phone,
          },
        ],
      },
    });
    if (existedUser && existedUser.email === payload.email) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.EMAIL_EXISTED),
      );
    }
    if (existedUser && existedUser.phone === payload.phone) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PHONE_EXISTED),
      );
    }
    if (confirmPassword !== payload.password) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PASSWORD_NOT_MATCH),
      );
    }
    const hashPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        password: hashPassword,
        roleId: role.id,
      },
    });
    await this.nodemailerService.sendMail({
      to: user.email,
      subject: MAIL_SUBJECT.STAFF_ACCOUNT,
      template: MAIL_TEMPLATE.STAFF_ACCOUNT,
      context: {
        email: `${payload.email}`,
        password: `${payload.password}`,
      },
    });
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const role = await this.prisma.role.findUnique({
      where: {
        name: EUserRole.USER,
      },
    });
    if (!role) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        roleId: role.id,
      },
    });
    if (!user) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    if (updateUserDto.levelId) {
      const level = await this.levelsService.findOne({
        where: {
          id: updateUserDto.levelId,
        },
      });
      if (!level) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(LEVEL_MESSAGE.LEVEL_NOT_FOUND),
        );
      }
    }
    if (updateUserDto.positionId) {
      const position = await this.positionsService.findOne({
        where: {
          id: updateUserDto.positionId,
        },
      });
      if (!position) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
        );
      }
    }
    if (updateUserDto.universityId) {
      const university = await this.universitiesService.findOne({
        where: {
          id: updateUserDto.universityId,
        },
      });
      if (!university) {
        ErrorHelper.NotFoundException(
          this.localesService.translate(
            UNIVERSITY_MESSAGE.UNIVERSITY_NOT_FOUND,
          ),
        );
      }
    }
    const hashPassword = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    updateUserDto['password'] = hashPassword;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
    });
  }

  async getUser(userId: number): Promise<User> {
    const role = await this.prisma.role.findUnique({
      where: {
        name: EUserRole.USER,
      },
    });
    if (!role) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        roleId: role.id,
      },
      include: {
        role: true,
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
    const role = await this.prisma.role.findUnique({
      where: {
        name: EUserRole.USER,
      },
    });
    if (!role) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        roleId: role.id,
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
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
        },
        include: {
          role: true,
        },
      }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }
  async findOne(args: any): Promise<User> {
    return this.prisma.user.findFirst(args);
  }

  async updateOne(args: any): Promise<User> {
    return this.prisma.user.update(args);
  }
}
