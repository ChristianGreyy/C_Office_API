import { Injectable } from '@nestjs/common';
import { Position } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT, SORT_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { POSITION_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { GetPositionsDto } from './dtos/get-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { CommonHelper } from 'src/helpers/common.helper';

@Injectable()
export class PositionsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createPosition(payload: CreatePositionDto): Promise<Position> {
    const position = await this.prisma.position.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (position) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_EXISTED),
      );
    }

    return this.prisma.position.create({
      data: {
        ...payload,
      },
    });
  }

  async updatePosition(
    positionId: number,
    payload: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.prisma.position.findFirst({
      where: {
        id: {
          not: positionId,
        },
        name: payload.name,
      },
    });
    if (position) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_EXISTED),
      );
    }
    return this.prisma.position.update({
      where: {
        id: positionId,
      },
      data: payload,
    });
  }

  async getPosition(positionId: number): Promise<Position> {
    const position = await this.prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });
    if (!position) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
      );
    }
    return position;
  }

  async deletePosition(positionId: number): Promise<Position> {
    const position = await this.prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });
    if (!position) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(POSITION_MESSAGE.POSITION_NOT_FOUND),
      );
    }
    return this.prisma.position.delete({
      where: {
        id: positionId,
      },
    });
  }

  async getPositions(query: GetPositionsDto): Promise<IPagination<Position>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, sort } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const orderBy = sort ? CommonHelper.handleSort(sort) : SORT_DEFAULT;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.position.count(),
      this.prisma.position.findMany({
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

  async findOne(args: any): Promise<Position> {
    return this.prisma.position.findUnique(args);
  }

  async updateOne(args: any): Promise<Position> {
    return this.prisma.position.update(args);
  }
}
