import { Injectable } from '@nestjs/common';
import { Issue, User } from '@prisma/client';
import { EUserRole } from 'src/common/enums';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import {
  CATEGORY_MESSAGE,
  ISSUE_MESSAGE,
  PRIORITY_MESSAGE,
  PROJECT_MESSAGE,
  STATUS_MESSAGE,
  TRACKER_MESSAGE,
  USER_MESSAGE,
} from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrioritiesService } from '../priorities/priorities.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { StatusService } from '../status/status.service';
import { TrackersService } from '../trackers/trackers.service';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { UsersService } from '../users/users.service';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { GetIssuesDto } from './dtos/get-issues.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private userProjectsService: UserProjectsService,
    private projectsService: ProjectsService,
    private prioritiesService: PrioritiesService,
    private trackersService: TrackersService,
    private statusService: StatusService,
    private readonly usersService: UsersService,
  ) {}

  async createIssue(user: User, payload: CreateIssueDto): Promise<Issue> {
    const project = await this.projectsService.findById(payload.projectId);
    if (!project) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }

    const assigner = await this.usersService.findById(payload.assignId);
    if (!assigner) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(USER_MESSAGE.USER_NOT_FOUND),
      );
    }

    const priority = await this.prioritiesService.findById(payload.priorityId);
    if (!priority) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PRIORITY_MESSAGE.PRIORITY_NOT_FOUND),
      );
    }

    const tracker = await this.trackersService.findById(payload.trackerId);
    if (!tracker) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(TRACKER_MESSAGE.TRACKER_NOT_FOUND),
      );
    }

    const status = await this.statusService.findById(payload.statusId);
    if (!status) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(STATUS_MESSAGE.STATUS_NOT_FOUND),
      );
    }

    if (user?.['role']?.name === EUserRole.USER) {
      const userProject = this.userProjectsService.findOne({
        where: {
          userId: user.id,
          projectId: payload.projectId,
        }
      });
      if (!userProject) {
        ErrorHelper.BadRequestException(
          this.localesService.translate(PROJECT_MESSAGE.YOU_NOT_IN_PROJECT),
        );
      }
    }

    const newIssue = await this.prisma.issue.create({
      data: {
        ...payload,
        startDate: new Date(payload.startDate),
        dueDate: new Date(payload.dueDate),
        creatorId: user.id
      },
    });

    return newIssue;
  }

  async updateIssue(issueId: number, user: User, payload: UpdateIssueDto): Promise<Issue> {
    const {output, ...passData} = payload;
    const issue = await this.prisma.issue.findFirst({
      where: {
        id: issueId,
      },
    });
    if (!issue) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ISSUE_MESSAGE.ISSUE_NOT_FOUND),
      );
    }
    if(output) {
      await this.prisma.issueOutput.create({
        data: {
          userId: user.id,
          comment: output,
          issueId: issue.id
        }
      })
    }
    return this.prisma.issue.update({
      where: {
        id: issueId,
      },
      data: passData,
    });
  }

  async getIssue(user: User, issueId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      include: {
        priority: true,
        status: true,
        tracker: true,
        assigner: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        creator: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        output: {
          select: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            },                          
            comment: true,
            createdAt: true
          },
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        },
      },
    });
    if (!issue) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(ISSUE_MESSAGE.ISSUE_NOT_FOUND),
      );
    }

    if (user?.['role']?.name === EUserRole.USER) {
      const userProject = this.userProjectsService.findOne({
        userId: user.id,
        projectId: issue.projectId,
      });
      if (!userProject) {
        ErrorHelper.BadRequestException(
          this.localesService.translate(PROJECT_MESSAGE.YOU_NOT_IN_PROJECT),
        );
      }
    }
    return issue;
  }

  async deleteIssue(issueId: number): Promise<Issue> {
    const issue = await this.prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });
    if (!issue) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(PROJECT_MESSAGE.PROJECT_NOT_FOUND),
      );
    }
    return this.prisma.issue.delete({
      where: {
        id: issueId,
      },
    });
  }

  async getIssues(
    user: User,
    query: GetIssuesDto,
  ): Promise<IPagination<Issue>> {
    const {
      limit = LIMIT_DEFAULT,
      page = PAGE_DEFAULT,
      projectId,
      trackerId,
      priorityId,
      statusId,
    } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    if(projectId) searchQuery['projectId'] = projectId;
    // if (projectId) {
    //   if (user?.['role']?.name === EUserRole.USER) {
    //     const userProject = await this.userProjectsService.findOne({
    //       userId: user.id,
    //       projectId,
    //     });
    //     if (!userProject) {
    //       ErrorHelper.BadRequestException(
    //         this.localesService.translate(PROJECT_MESSAGE.YOU_NOT_IN_PROJECT),
    //       );
    //     }
    //   }
    //   searchQuery['projectId'] = projectId;
    // } else {
    //   if (user?.['role']?.name === EUserRole.USER) {
    //     const userProjects = await this.userProjectsService.findMany({
    //       userId: user.id,
    //     });
    //     const projectIds = userProjects.map((item) => item.projectId);
    //     searchQuery['projectId'] = {
    //       in: {
    //         in: projectIds,
    //       },
    //     };
    //   }
    // }
    if (trackerId) {
      searchQuery['trackerId'] = trackerId;
    }
    if (statusId) {
      searchQuery['statusId'] = statusId;
    }
    if (priorityId) {
      searchQuery['priorityId'] = priorityId;
    }
    const [total, items] = await this.prisma.$transaction([
      this.prisma.issue.count(),
      this.prisma.issue.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
        },
        include: {
          priority: true,
          status: true,
          tracker: true,
          assigner: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async findOne(args: any): Promise<Issue> {
    return this.prisma.issue.findUnique(args);
  }

  async updateOne(args: any): Promise<Issue> {
    return this.prisma.issue.update(args);
  }
}
