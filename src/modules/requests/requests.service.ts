import { Injectable } from '@nestjs/common';
import { Request, User } from '@prisma/client';
import { ERequestStatus } from 'src/common/enums';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { REQUEST_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { GetRequestsDto } from './dtos/get-requests.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private userProjectsService: UserProjectsService,
  ) {}

  async createRequest(user: User, payload: CreateRequestDto): Promise<Request> {
    return this.prisma.request.create({
      data: {
        ...payload,
        status: ERequestStatus.PENDING,
        userId: user.id,
      },
    });
  }

  async updateRequest(requestId: number, user: User, payload: UpdateRequestDto): Promise<Request> {
    const request = await this.prisma.request.findFirst({
      where: {
        id: requestId,
      },
    });
    if (!request) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(REQUEST_MESSAGE.REQUEST_NOT_FOUND),
      );
    }
    return this.prisma.request.update({
      where: {
        id: requestId,
      },
      data: payload,
    });
  }

  async getRequests(query: GetRequestsDto): Promise<IPagination<Request>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, search, status, type } = query;
    const offset = (page - 1) * limit;

    // const startHour = query.dateTime ? new Date(query.dateTime) : new Date();
    // startHour.setUTCHours(0, 0, 0, 0);

    // const endHour = query.dateTime ? new Date(query.dateTime) : new Date();
    // endHour.setUTCHours(23, 59, 59, 999);

    const searchQuery = {

    };

    // if (search) {
    //   searchQuery['name'] = {
    //     contains: search,
    //     mode: 'insensitive',
    //   };
    // }

    if(type) {
      searchQuery['type'] = type.replace('-', '_');
    }

    if(status) {
      searchQuery['status'] = status;
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.request.count(),
      this.prisma.request.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
        },
        include: {
          user: {
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

  async findOne(args: any): Promise<Request> {
    return this.prisma.request.findUnique(args);
  }

  async updateOne(args: any): Promise<Request> {
    return this.prisma.request.update(args);
  }
}
