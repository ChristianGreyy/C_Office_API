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
import { Priority } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { PRIORITY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreatePriorityDto } from './dtos/create-priority.dto';
import { GetPrioritiesDto } from './dtos/get-priorities.dto';
import { UpdatePriorityDto } from './dtos/update-priority.dto';
import { PrioritiesService } from './priorities.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('priorities')
@ApiBearerAuth()
@Controller('priorities')
export class PrioritiesController {
  constructor(
    private readonly prioritiesService: PrioritiesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_PRIORITY)
  async createPriority(@Body() createPriorityDto: CreatePriorityDto): Promise<{
    message: string;
    data: Priority;
  }> {
    return {
      message: this.localesService.translate(
        PRIORITY_MESSAGE.CREATE_PRIORITY_SUCCESS,
      ),
      data: await this.prioritiesService.createPriority(createPriorityDto),
    };
  }

  @Put(':priorityId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_PRIORITY)
  async updatePriority(
    @Param('priorityId') priorityId: number,
    @Body() updatePriorityDto: UpdatePriorityDto,
  ): Promise<{
    message: string;
    data: Priority;
  }> {
    return {
      message: this.localesService.translate(
        PRIORITY_MESSAGE.UPDATE_PRIORITY_SUCCESS,
      ),
      data: await this.prioritiesService.updatePriority(
        priorityId,
        updatePriorityDto,
      ),
    };
  }

  @Get(':priorityId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_PRIORITY)
  async getPriority(
    @Param('priorityId') priorityId: number,
  ): Promise<Priority> {
    return this.prioritiesService.getPriority(priorityId);
  }

  @Delete(':priorityId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_PRIORITY)
  async deletePriority(@Param('priorityId') priorityId: number): Promise<{
    message: string;
    data: Priority;
  }> {
    return {
      message: this.localesService.translate(
        PRIORITY_MESSAGE.DELETE_PRIORITY_SUCCESS,
      ),
      data: await this.prioritiesService.deletePriority(priorityId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_PRIORITIES)
  async getPriorities(
    @Query() getPrioritiesDto: GetPrioritiesDto,
  ): Promise<IPagination<Priority>> {
    return this.prioritiesService.getPriorities(getPrioritiesDto);
  }
}
