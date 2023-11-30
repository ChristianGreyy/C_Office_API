import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { ROLE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { GetRolesDto } from './dtos/get-roles.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async createRole(payload: CreateRoleDto): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: {
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
    const { limit, offset, startingId } = query;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.role.count(),
      this.prisma.role.findMany({
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

  async findOne(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return this.prisma.role.findUnique({
      where,
    });
  }

  async updateOne(
    where: Prisma.RoleWhereUniqueInput,
    data: Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>,
  ): Promise<Role> {
    return this.prisma.role.update({
      where,
      data,
    });
  }
}