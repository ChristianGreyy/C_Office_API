import { Injectable } from '@nestjs/common';
import { Sprint } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PROJECT_MESSAGE, SPRINT_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSprintDto } from './dtos/create-sprint.dto';
import { GetSprintsDto } from './dtos/get-sprints.dto';
import { UpdateSprintDto } from './dtos/update-sprint.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class SprintsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private projectsService: ProjectsService,
  ) {}

  async createSprint(payload: CreateSprintDto): Promise<Sprint> {
    const project = await this.projectsService.findOne({
      where: {
        id: payload.projectId
      }
    })
    if(!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    const sprint = await this.prisma.sprint.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (sprint) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(SPRINT_MESSAGE.SPRINT_EXISTED),
      );
    }

    return this.prisma.sprint.create({
      data: {
        ...payload,
      },
    });
  }

  async updateSprint(
    sprintId: number,
    payload: UpdateSprintDto,
  ): Promise<Sprint> {
    const sprint = await this.prisma.sprint.findFirst({
      where: {
        id: sprintId,
      },
    });
    if (!sprint) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(SPRINT_MESSAGE.SPRINT_NOT_FOUND),
      );
    }
    return this.prisma.sprint.update({
      where: {
        id: sprintId,
      },
      data: payload,
    });
  }

  async getSprint(sprintId: number): Promise<Sprint> {
    const sprint = await this.prisma.sprint.findUnique({
      where: {
        id: sprintId,
      },
    });
    if (!sprint) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(SPRINT_MESSAGE.SPRINT_NOT_FOUND),
      );
    }
    return sprint;
  }

  async deleteSprint(sprintId: number): Promise<Sprint> {
    const sprint = await this.prisma.sprint.findUnique({
      where: {
        id: sprintId,
      },
    });
    if (!sprint) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(SPRINT_MESSAGE.SPRINT_NOT_FOUND),
      );
    }
    return this.prisma.sprint.delete({
      where: {
        id: sprintId,
      },
    });
  }

  async getSprints(
    projectId: number,
    query: GetSprintsDto,
  ): Promise<IPagination<Sprint>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.sprint.count({
        where: {
          projectId,
        }
      }),
      this.prisma.sprint.findMany({
        take: limit,
        skip: offset,
        where: {
          projectId,
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

  async findOne(args: any): Promise<Sprint> {
    return this.prisma.sprint.findFirst(args);
  }

  async findMany(args: any): Promise<Sprint[]> {
    return this.prisma.sprint.findMany(args);
  }

  async updateOne(args: any): Promise<Sprint> {
    return this.prisma.sprint.update(args);
  }
}
