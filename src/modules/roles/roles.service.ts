import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { LIMIT_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PERMISSION_MESSAGE, ROLE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { GetRolesDto } from './dtos/get-roles.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createRole(payload: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionsService.findMany({
      where: {
        id: {
          in: payload.permissionIds,
        },
      },
    });
    if (permissions.length !== payload.permissionIds.length) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(
          PERMISSION_MESSAGE.PERMISSION_IDS_INVALID,
        ),
      );
    }
    const role = await this.prisma.role.findFirst({
      where: {
        name: payload.name,
      },
    });
    if (role) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ROLE_MESSAGE.ROLE_EXISTED),
      );
    }

    return this.prisma.role.create({
      data: {
        ...payload,
      },
    });
  }

  async updateRole(roleId: number, payload: UpdateRoleDto): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: {
          not: roleId,
        },
        name: {
          contains: payload.name,
        },
      },
    });
    if (role) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ROLE_MESSAGE.ROLE_EXISTED),
      );
    }
    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: payload,
    });
  }

  async getRole(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ROLE_MESSAGE.ROLE_NOT_FOUND),
      );
    }
    return role;
  }

  async deleteRole(roleId: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ROLE_MESSAGE.ROLE_NOT_FOUND),
      );
    }
    return this.prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }

  async getRoles(query: GetRolesDto): Promise<IPagination<Role>> {
    const { limit = LIMIT_DEFAULT, page } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.role.count(),
      this.prisma.role.findMany({
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

  async findOne(args: any): Promise<Role> {
    return this.prisma.role.findUnique(args);
  }

  async updateOne(args: any): Promise<Role> {
    return this.prisma.role.update(args);
  }
}
