import { Injectable } from '@nestjs/common';
import { EmployeeAttendance, User } from '@prisma/client';
import { EUserRole } from 'src/common/enums';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from 'src/constants';
import { ErrorHelper } from 'src/helpers';
import { IPagination } from 'src/interfaces/response.interface';
import { EMPLOYEE_ATTENDANCE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { CreateEmployeeAttendanceDto } from './dtos/create-employee-attendance.dto';
import { GetEmployeeAttendancesDto } from './dtos/get-employee-attendances.dto';

@Injectable()
export class EmployeeAttendancesService {
  constructor(
    private readonly prisma: PrismaService,
    private localesService: LocalesService,
    private userProjectsService: UserProjectsService,
  ) {}

  async createEmployeeAttendance(
    user: User,
    payload: CreateEmployeeAttendanceDto,
  ): Promise<EmployeeAttendance> {
    console.log(payload.dateTime)

    const startHour = new Date();
    startHour.setUTCHours(0, 0, 0, 0);

    const endHour = new Date();
    endHour.setUTCHours(23, 59, 59, 999);

    const dateTime = new Date(payload.dateTime);

    if (dateTime < startHour || dateTime > endHour) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(
          EMPLOYEE_ATTENDANCE_MESSAGE.INVALID_CHECK_TIME,
        ),
      );
    }

    let employeeAttendance = await this.prisma.employeeAttendance.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startHour,
          lte: endHour,
        },
      },
    });

    if (!employeeAttendance) {
      employeeAttendance = await this.prisma.employeeAttendance.create({
        data: {
          userId: user.id,
          checkInTime: payload.dateTime,
          checkOutTime: null,
        },
      });
    } else {
      employeeAttendance = await this.prisma.employeeAttendance.update({
        where: {
          id: employeeAttendance.id,
        },
        data: {
          checkOutTime: payload.dateTime,
        },
      });
    }

    return employeeAttendance;
  }

  async getEmployeeAttendancesByProfile(
    user: User,
  ): Promise<EmployeeAttendance[]> {
    const employeeAttendances = await this.prisma.employeeAttendance.findMany({
      where: {
        userId: user.id,
      },
    });

    return employeeAttendances;
  }

  async getEmployeeAttendanceByProfile(
    user: User,
  ): Promise<EmployeeAttendance> {
    const startHour = new Date();
    startHour.setUTCHours(0, 0, 0, 0);

    const endHour = new Date();
    endHour.setUTCHours(23, 59, 59, 999);
    
    let employeeAttendance = await this.prisma.employeeAttendance.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startHour,
          lte: endHour,
        },
      },
    });

    return employeeAttendance;
  }

  async getEmployeeAttendances(
    query: GetEmployeeAttendancesDto,
  ): Promise<IPagination<EmployeeAttendance>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT } = query;
    const offset = (page - 1) * limit;

    const startHour = query.dateTime ? new Date(query.dateTime) : new Date();
    startHour.setUTCHours(0, 0, 0, 0);

    const endHour = query.dateTime ? new Date(query.dateTime) : new Date();
    endHour.setUTCHours(23, 59, 59, 999);

    const searchQuery = {
      createdAt: {
        gte: startHour,
        lte: endHour,
      },
    };
    
    const [total, items] = await this.prisma.$transaction([
      this.prisma.employeeAttendance.count(),
      this.prisma.employeeAttendance.findMany({
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
          }
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

  async findOne(args: any): Promise<EmployeeAttendance> {
    return this.prisma.employeeAttendance.findUnique(args);
  }

  async updateOne(args: any): Promise<EmployeeAttendance> {
    return this.prisma.employeeAttendance.update(args);
  }
}
