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
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { STATUS_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateStatusDto } from './dtos/create-status.dto';
import { GetStatusDto } from './dtos/get-status.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { StatusService } from './status.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('status')
@ApiBearerAuth()
@Controller('status')
export class StatusController {
  constructor(
    private readonly statusService: StatusService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_STATUS)
  async createStatus(@Body() createStatusDto: CreateStatusDto): Promise<{
    message: string;
    data: Status;
  }> {
    return {
      message: this.localesService.translate(
        STATUS_MESSAGE.CREATE_STATUS_SUCCESS,
      ),
      data: await this.statusService.createStatus(createStatusDto),
    };
  }

  @Put(':statusId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_STATUS)
  async updateStatus(
    @Param('statusId') statusId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{
    message: string;
    data: Status;
  }> {
    return {
      message: this.localesService.translate(
        STATUS_MESSAGE.UPDATE_STATUS_SUCCESS,
      ),
      data: await this.statusService.updateStatus(
        statusId,
        updateStatusDto,
      ),
    };
  }

  @Get(':statusId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_STATUS)
  async getStatus(
    @Param('statusId') statusId: number,
  ): Promise<Status> {
    return this.statusService.getStatus(statusId);
  }

  @Delete(':statusId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_STATUS)
  async deleteStatus(@Param('statusId') statusId: number): Promise<{
    message: string;
    data: Status;
  }> {
    return {
      message: this.localesService.translate(
        STATUS_MESSAGE.DELETE_STATUS_SUCCESS,
      ),
      data: await this.statusService.deleteStatus(statusId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_ALL_STATUS)
  async getAllStatus(
    @Query() getStatusDto: GetStatusDto,
  ): Promise<IPagination<Status>> {
    return this.statusService.getAllStatus(getStatusDto);
  }
}
