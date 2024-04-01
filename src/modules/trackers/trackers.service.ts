import { Injectable } from '@nestjs/common';
import { Tracker } from '@prisma/client';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { TRACKER_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PermissionsService } from '../permissions/permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackerDto } from './dtos/create-tracker.dto';
import { GetTrackersDto } from './dtos/get-trackers.dto';
import { UpdateTrackerDto } from './dtos/update-tracker.dto';

@Injectable()
export class TrackersService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private permissionsService: PermissionsService,
  ) {}

  async createTracker(payload: CreateTrackerDto): Promise<Tracker> {
    const tracker = await this.prisma.tracker.findFirst({
      where: {
        name: {
          contains: payload.name,
        },
      },
    });
    if (tracker) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(TRACKER_MESSAGE.TRACKER_EXISTED),
      );
    }

    return this.prisma.tracker.create({
      data: {
        ...payload,
      },
    });
  }

  async updateTracker(
    trackerId: number,
    payload: UpdateTrackerDto,
  ): Promise<Tracker> {
    const tracker = await this.prisma.tracker.findFirst({
      where: {
        id: {
          not: trackerId,
        },
        name: payload.name,
      },
    });
    if (tracker) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(TRACKER_MESSAGE.TRACKER_EXISTED),
      );
    }
    return this.prisma.tracker.update({
      where: {
        id: trackerId,
      },
      data: payload,
    });
  }

  async getTracker(trackerId: number): Promise<Tracker> {
    const tracker = await this.prisma.tracker.findUnique({
      where: {
        id: trackerId,
      },
    });
    if (!tracker) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(TRACKER_MESSAGE.TRACKER_NOT_FOUND),
      );
    }
    return tracker;
  }

  async deleteTracker(trackerId: number): Promise<Tracker> {
    const tracker = await this.prisma.tracker.findUnique({
      where: {
        id: trackerId,
      },
    });
    if (!tracker) {
      ErrorHelper.NotFoundException(
        this.localesService.translate(TRACKER_MESSAGE.TRACKER_NOT_FOUND),
      );
    }
    return this.prisma.tracker.delete({
      where: {
        id: trackerId,
      },
    });
  }

  async getTrackers(query: GetTrackersDto): Promise<IPagination<Tracker>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.tracker.count(),
      this.prisma.tracker.findMany({
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

  async findOne(args: any): Promise<Tracker> {
    return this.prisma.tracker.findUnique(args);
  }

  async updateOne(args: any): Promise<Tracker> {
    return this.prisma.tracker.update(args);
  }

  async findById(id: number): Promise<Tracker> {
    return this.prisma.tracker.findFirst({
      where: {
        id
      }
    });
  }
}
