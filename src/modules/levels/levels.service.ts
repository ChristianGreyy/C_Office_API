import { Injectable } from '@nestjs/common';
import { Level } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT, SORT_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { POSITION_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLevelDto } from './dtos/create-level.dto';
import { GetLevelsDto } from './dtos/get-level.dto';
import { UpdateLevelDto } from './dtos/update-level.dto';
import { CommonHelper } from 'src/helpers/common.helper';

@Injectable()
export class LevelsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createLevel(payload: CreateLevelDto): Promise<Level> {
    const level = await this.prisma.level.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (level) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_EXISTED),
      );
    }

    return this.prisma.level.create({
      data: {
        ...payload,
      },
    });
  }

  async updateLevel(levelId: number, payload: UpdateLevelDto): Promise<Level> {
    const level = await this.prisma.level.findFirst({
      where: {
        id: {
          not: levelId,
        },
        name: payload.name,
      },
    });
    if (level) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_EXISTED),
      );
    }
    return this.prisma.level.update({
      where: {
        id: levelId,
      },
      data: payload,
    });
  }

  async getLevel(levelId: number): Promise<Level> {
    const level = await this.prisma.level.findUnique({
      where: {
        id: levelId,
      },
    });
    if (!level) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
      );
    }
    return level;
  }

  async deleteLevel(levelId: number): Promise<Level> {
    const level = await this.prisma.level.findUnique({
      where: {
        id: levelId,
      },
    });
    if (!level) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
      );
    }
    return this.prisma.level.delete({
      where: {
        id: levelId,
      },
    });
  }

  async getLevels(query: GetLevelsDto): Promise<IPagination<Level>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, sort } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const orderBy = sort ? CommonHelper.handleSort(sort) : SORT_DEFAULT;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.level.count(),
      this.prisma.level.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
        },
        orderBy
      }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async findOne(args: any): Promise<Level> {
    return this.prisma.level.findUnique(args);
  }

  async updateOne(args: any): Promise<Level> {
    return this.prisma.level.update(args);
  }
}
