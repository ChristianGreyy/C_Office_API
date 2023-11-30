import { Injectable } from '@nestjs/common';
import { Prisma, Permission } from '@prisma/client';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PERMISSION_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { GetPermissionsDto } from './dtos/get-permissions.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createPermission(payload: CreatePermissionDto): Promise<Permission> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (permission) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PERMISSION_MESSAGE.PERMISSION_EXISTED),
      );
    }

    return this.prisma.permission.create({
      data: {
        ...payload,
      },
    });
  }

  async updatePermission(
    permissionId: number,
    payload: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        id: {
          not: permissionId,
        },
        name: {
          contains: payload.name,
        },
      },
    });
    if (permission) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PERMISSION_MESSAGE.PERMISSION_EXISTED),
      );
    }
    return this.prisma.permission.update({
      where: {
        id: permissionId,
      },
      data: payload,
    });
  }

  async getPermission(permissionId: number): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: permissionId,
      },
    });
    if (!permission) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PERMISSION_MESSAGE.PERMISSION_NOT_FOUND),
      );
    }
    return permission;
  }

  async deletePermission(permissionId: number): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id: permissionId,
      },
    });
    if (!permission) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PERMISSION_MESSAGE.PERMISSION_NOT_FOUND),
      );
    }
    return this.prisma.permission.delete({
      where: {
        id: permissionId,
      },
    });
  }

  async getPermissions(
    query: GetPermissionsDto,
  ): Promise<IPagination<Permission>> {
    const { limit, offset, startingId } = query;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.permission.count(),
      this.prisma.permission.findMany({
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

  async findOne(where: Prisma.PermissionWhereUniqueInput): Promise<Permission> {
    return this.prisma.permission.findUnique({
      where,
    });
  }

  async updateOne(
    where: Prisma.PermissionWhereUniqueInput,
    data: Prisma.XOR<
      Prisma.PermissionUpdateInput,
      Prisma.PermissionUncheckedUpdateInput
    >,
  ): Promise<Permission> {
    return this.prisma.permission.update({
      where,
      data,
    });
  }
}
