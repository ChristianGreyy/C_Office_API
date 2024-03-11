import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PRIORITY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStatusDto } from './dtos/create-status.dto';
import { GetStatusDto } from './dtos/get-status.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Injectable()
export class StatusService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createStatus(payload: CreateStatusDto): Promise<Status> {
    const status = await this.prisma.status.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (status) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_EXISTED),
      );
    }

    return this.prisma.status.create({
      data: {
        ...payload,
      },
    });
  }

  async updateStatus(
    statusId: number,
    payload: UpdateStatusDto,
  ): Promise<Status> {
    const status = await this.prisma.status.findFirst({
      where: {
        id: {
          not: statusId,
        },
        name: payload.name,
      },
    });
    if (status) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_EXISTED),
      );
    }
    return this.prisma.status.update({
      where: {
        id: statusId,
      },
      data: payload,
    });
  }

  async getStatus(statusId: number): Promise<Status> {
    const status = await this.prisma.status.findUnique({
      where: {
        id: statusId,
      },
    });
    if (!status) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_NOT_FOUND),
      );
    }
    return status;
  }

  async deleteStatus(statusId: number): Promise<Status> {
    const status = await this.prisma.status.findUnique({
      where: {
        id: statusId,
      },
    });
    if (!status) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_NOT_FOUND),
      );
    }
    return this.prisma.status.delete({
      where: {
        id: statusId,
      },
    });
  }

  async getAllStatus(query: GetStatusDto): Promise<IPagination<Status>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.status.count(),
      this.prisma.status.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
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

  async findOne(args: any): Promise<Status> {
    return this.prisma.status.findUnique(args);
  }

  async updateOne(args: any): Promise<Status> {
    return this.prisma.status.update(args);
  }
}
