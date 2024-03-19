import { Injectable } from '@nestjs/common';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { PROJECT_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { GetProjectsDto } from './dtos/get-projects.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { EUserProjectRole, EUserRole } from 'src/common/enums';
import { Project, User } from '@prisma/client';
import { UpdateProjectMembersDto } from './dtos/update-project-members.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private readonly userProjectsService: UserProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async createProject(userId: number, payload: CreateProjectDto): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_EXISTED),
      );
    }

    const newProject = await this.prisma.project.create({
      data: {
        ...payload,
      },
    });

    const userProject = await this.userProjectsService.create({
      userId,
      projectId: newProject.id,
      role: EUserProjectRole.MANAGER
    })

    return newProject;
  }

  async updateProject(
    projectId: number,
    payload: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId
      }
    })
    if(!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    const existedProject = await this.prisma.project.findFirst({
      where: {
        id: {
          not: projectId,
        },
        name: payload.name,
      },
    });
    if (existedProject) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_EXISTED),
      );
    }
    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: payload,
    });
  }

  async getMembersForProject(projectId: number): Promise<any> {
    const userProjects = await this.userProjectsService.findMany({
      where: {
        projectId
      },
      select: {
        role: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        }
      },
    }) 
    return userProjects.map(item => {
      item['user']['role'] = item.role;
      return item; 
    });
  }

  async updateMembersForProject(
    projectId: number,
    payload: UpdateProjectMembersDto,
  ): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId
      }
    })
    if(!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    const memberIds = payload.members.map(item => item.userId); 
    const members = payload.members.map(item => {
      item['projectId'] = project.id;
      return item;
    })
    const users = await
      this.usersService.findMany({
        where: {
          id: {
            in: memberIds,
          },
        }
      })
    if(users.length !== memberIds.length) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(PROJECT_MESSAGE.UPDATE_MEMBERS_FAIL),
      );
    }
    await this.userProjectsService.deleteMany({
      where: {
        projectId
      }
    })
    await this.userProjectsService.createMany(members)
    return;
  }

  async getProject(user: User, projectId: number): Promise<Project> {
    if(user?.['role']?.name === EUserRole.USER) {
      const userProject = this.userProjectsService.findOne({
        userId: user.id,
        projectId
      })
      if(!userProject) {
        ErrorHelper.BadRequestException(
          this.localesService.translate(PROJECT_MESSAGE.YOU_NOT_IN_PROJECT),
        );
      }
    }
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    return project;
  }

  async deleteProject(projectId: number): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    return this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  async getProjects(query: GetProjectsDto): Promise<IPagination<Project>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.project.count(),
      this.prisma.project.findMany({
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

  async findById(id: number): Promise<Project> {
    return this.prisma.project.findFirst({
      where: {
        id
      }
    });
  }

  async findOne(args: any): Promise<Project> {
    return this.prisma.project.findFirst(args);
  }

  async updateOne(args: any): Promise<Project> {
    return this.prisma.project.update(args);
  }
}
