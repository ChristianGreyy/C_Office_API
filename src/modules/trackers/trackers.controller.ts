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
import { Tracker } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { TRACKER_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateTrackerDto } from './dtos/create-tracker.dto';
import { GetTrackersDto } from './dtos/get-trackers.dto';
import { UpdateTrackerDto } from './dtos/update-tracker.dto';
import { TrackersService } from './trackers.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('trackers')
@ApiBearerAuth()
@Controller('trackers')
export class TrackersController {
  constructor(
    private readonly trackersService: TrackersService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_TRACKER)
  async createTracker(@Body() createTrackerDto: CreateTrackerDto): Promise<{
    message: string;
    data: Tracker;
  }> {
    return {
      message: this.localesService.translate(
        TRACKER_MESSAGE.CREATE_TRACKER_SUCCESS,
      ),
      data: await this.trackersService.createTracker(createTrackerDto),
    };
  }

  @Put(':trackerId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_TRACKER)
  async updateTracker(
    @Param('trackerId') trackerId: number,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ): Promise<{
    message: string;
    data: Tracker;
  }> {
    return {
      message: this.localesService.translate(
        TRACKER_MESSAGE.UPDATE_TRACKER_SUCCESS,
      ),
      data: await this.trackersService.updateTracker(
        trackerId,
        updateTrackerDto,
      ),
    };
  }

  @Get(':trackerId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_TRACKER)
  async getTracker(
    @Param('trackerId') trackerId: number,
  ): Promise<Tracker> {
    return this.trackersService.getTracker(trackerId);
  }

  @Delete(':trackerId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_TRACKER)
  async deleteTracker(@Param('trackerId') trackerId: number): Promise<{
    message: string;
    data: Tracker;
  }> {
    return {
      message: this.localesService.translate(
        TRACKER_MESSAGE.UPDATE_TRACKER_SUCCESS,
      ),
      data: await this.trackersService.deleteTracker(trackerId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_TRACKERS)
  async getTrackers(
    @Query() getTrackersDto: GetTrackersDto,
  ): Promise<IPagination<Tracker>> {
    return this.trackersService.getTrackers(getTrackersDto);
  }
}
