import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { CATEGORY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { GetCategoriesDto } from './dtos/get-categories.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createCategory(payload: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (category) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(CATEGORY_MESSAGE.CATEGORY_EXISTED),
      );
    }

    return this.prisma.category.create({
      data: {
        ...payload,
      },
    });
  }

  async updateCategory(
    categoryId: number,
    payload: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: {
          not: categoryId,
        },
        name: payload.name,
      },
    });
    if (category) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(CATEGORY_MESSAGE.CATEGORY_EXISTED),
      );
    }
    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: payload,
    });
  }

  async getCategory(categoryId: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(CATEGORY_MESSAGE.CATEGORY_NOT_FOUND),
      );
    }
    return category;
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(CATEGORY_MESSAGE.CATEGORY_NOT_FOUND),
      );
    }
    return this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }

  async getCategories(query: GetCategoriesDto): Promise<IPagination<Category>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.category.count(),
      this.prisma.category.findMany({
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

  async findOne(args: any): Promise<Category> {
    return this.prisma.category.findUnique(args);
  }

  async updateOne(args: any): Promise<Category> {
    return this.prisma.category.update(args);
  }

  async findById(id: number): Promise<Category> {
    return this.prisma.category.findFirst({
      where: {
        id
      }
    });
  }
}
