import { Injectable } from '@nestjs/common';
import { University } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT, SORT_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { UNIVERSITY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dtos/create-university.dto';
import { GetUniversitiesDto } from './dtos/get-university.dto';
import { UpdateUniversityDto } from './dtos/update-university.dto';
import { CommonHelper } from 'src/helpers/common.helper';

@Injectable()
export class UniversitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createUniversity(payload: CreateUniversityDto): Promise<University> {
    const university = await this.prisma.university.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (university) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(UNIVERSITY_MESSAGE.UNIVERSITY_EXISTED),
      );
    }

    return this.prisma.university.create({
      data: {
        ...payload,
      },
    });
  }

  async updateUniversity(
    universityId: number,
    payload: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.prisma.university.findFirst({
      where: {
        id: {
          not: universityId,
        },
        name: payload.name,
      },
    });
    if (university) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(UNIVERSITY_MESSAGE.UNIVERSITY_EXISTED),
      );
    }
    return this.prisma.university.update({
      where: {
        id: universityId,
      },
      data: payload,
    });
  }

  async getUniversity(universityId: number): Promise<University> {
    const university = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });
    if (!university) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(UNIVERSITY_MESSAGE.UNIVERSITY_NOT_FOUND),
      );
    }
    return university;
  }

  async deleteUniversity(universityId: number): Promise<University> {
    const university = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });
    if (!university) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(UNIVERSITY_MESSAGE.UNIVERSITY_NOT_FOUND),
      );
    }
    return this.prisma.university.delete({
      where: {
        id: universityId,
      },
    });
  }

  async getUniversities(
    query: GetUniversitiesDto,
  ): Promise<IPagination<University>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, sort } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const orderBy = sort ? CommonHelper.handleSort(sort) : SORT_DEFAULT;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.university.count(),
      this.prisma.university.findMany({
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

  async findOne(args: any): Promise<University> {
    return this.prisma.university.findUnique(args);
  }

  async updateOne(args: any): Promise<University> {
    return this.prisma.university.update(args);
  }
}
