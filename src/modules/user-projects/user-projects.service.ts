import { Injectable } from '@nestjs/common';
import { UserProject } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PROJECT_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserProjectDto } from './dtos/create-user-project.dto';
import { GetUserProjectsDto } from './dtos/get-user-projects.dto';
import { UpdateUserProjectDto } from './dtos/update-user-project.dto';
import { EUserProjectRole } from 'src/common/enums';

@Injectable()
export class UserProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
  ) {}

  async updateUserProject(
    projectId: number,
    payload: UpdateUserProjectDto,
  ): Promise<UserProject> {
    return this.prisma.userProject.update({
      where: {
        id: projectId,
      },
      data: payload,
    });
  }

  async create(args: any): Promise<UserProject> {
    return this.prisma.userProject.create({
      data: args
    });
  }

  async createMany(args: any[]): Promise<any> {
    return this.prisma.userProject.createMany({
      data: args,
      skipDuplicates: true
    });
  }

  async findOne(args: any): Promise<UserProject> {
    return this.prisma.userProject.findFirst(args);
  }

  async findMany(args: any): Promise<UserProject[]> {
    return this.prisma.userProject.findMany(args);
  }

  async updateOne(args: any): Promise<UserProject> {
    return this.prisma.userProject.update(args);
  }

  async deleteOne(args: any): Promise<UserProject> {
    return this.prisma.userProject.delete(args);
  }

  async deleteMany(args: any): Promise<any> {
    return this.prisma.userProject.deleteMany(args);
  }
}
