import { Injectable } from '@nestjs/common';
import { Priority } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PRIORITY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriorityDto } from './dtos/create-priority.dto';
import { GetPrioritiesDto } from './dtos/get-priorities.dto';
import { UpdatePriorityDto } from './dtos/update-priority.dto';

@Injectable()
export class PrioritiesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createPriority(payload: CreatePriorityDto): Promise<Priority> {
    const priority = await this.prisma.priority.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (priority) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_EXISTED),
      );
    }

    return this.prisma.priority.create({
      data: {
        ...payload,
      },
    });
  }

  async updatePriority(
    priorityId: number,
    payload: UpdatePriorityDto,
  ): Promise<Priority> {
    const priority = await this.prisma.priority.findFirst({
      where: {
        id: {
          not: priorityId,
        },
        name: payload.name,
      },
    });
    if (priority) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_EXISTED),
      );
    }
    return this.prisma.priority.update({
      where: {
        id: priorityId,
      },
      data: payload,
    });
  }

  async getPriority(priorityId: number): Promise<Priority> {
    const priority = await this.prisma.priority.findUnique({
      where: {
        id: priorityId,
      },
    });
    if (!priority) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_NOT_FOUND),
      );
    }
    return priority;
  }

  async deletePriority(priorityId: number): Promise<Priority> {
    const priority = await this.prisma.priority.findUnique({
      where: {
        id: priorityId,
      },
    });
    if (!priority) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_NOT_FOUND),
      );
    }
    return this.prisma.priority.delete({
      where: {
        id: priorityId,
      },
    });
  }

  async getPriorities(query: GetPrioritiesDto): Promise<IPagination<Priority>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.priority.count(),
      this.prisma.priority.findMany({
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

  async findOne(args: any): Promise<Priority> {
    return this.prisma.priority.findUnique(args);
  }

  async updateOne(args: any): Promise<Priority> {
    return this.prisma.priority.update(args);
  }
}
