import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { EmployeeAttendance, User } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { ISSUE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateEmployeeAttendanceDto } from './dtos/create-employee-attendance.dto';
import { GetEmployeeAttendancesDto } from './dtos/get-employee-attendances.dto';
import { EmployeeAttendancesService } from './employee-attendances.service';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('employee-attendances')
@ApiBearerAuth()
@Controller('employee-attendances')
export class EmployeeAttendancesController {
  constructor(
    private readonly employeeAttendancesService: EmployeeAttendancesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'API Create employeeAttendance in project' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async createEmployeeAttendance(@Body() createEmployeeAttendanceDto: CreateEmployeeAttendanceDto,
    @UserDecorator() user: User 
  ): Promise<{
    message: string;
    data: EmployeeAttendance;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.CREATE_ISSUE_SUCCESS,
      ),
      data: await this.employeeAttendancesService.createEmployeeAttendance(user, createEmployeeAttendanceDto),
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'API Get employee attendances by profile' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getEmployeeAttendancesByProfile(
    @UserDecorator() user: User
  ): Promise<EmployeeAttendance[]> {
    return this.employeeAttendancesService.getEmployeeAttendancesByProfile(user);
  }

  @Get('profile/current')
  @ApiOperation({ summary: 'API Get current employee attendance by profile' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getEmployeeAttendanceByProfile(
    @UserDecorator() user: User
  ): Promise<EmployeeAttendance> {
    return this.employeeAttendancesService.getEmployeeAttendanceByProfile(user);
  }

  @Get()
  @ApiOperation({ summary: 'API Get all employeeAttendances' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getEmployeeAttendances(
    @UserDecorator() user: User,
    @Query() getEmployeeAttendancesDto: GetEmployeeAttendancesDto,
  ): Promise<IPagination<EmployeeAttendance>> {
    return this.employeeAttendancesService.getEmployeeAttendances(getEmployeeAttendancesDto);
  }
}
