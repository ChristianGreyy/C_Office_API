import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
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
  ): Promise<Permission[]> {
    const permisions = await this.prisma.permission.findMany();
    const result = [];
    for(const permission of permisions) {
      const checkModule = result.findIndex(item => item.module === permission.module);
      if(checkModule === -1) {
        result.push({
          module: permission.module,
          permissions: [permission]
        })
      } else {
        result[checkModule]['permissions'].push(permission);
      }
    }
    return result;
  }

  async findOne(args: any): Promise<Permission> {
    return this.prisma.permission.findFirst(args);
  }

  async findMany(args: any): Promise<Permission[]> {
    return this.prisma.permission.findMany(args);
  }

  async updateOne(args: any): Promise<Permission> {
    return this.prisma.permission.update(args);
  }
}
