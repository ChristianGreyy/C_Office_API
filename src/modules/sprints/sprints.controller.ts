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
import { Sprint } from '@prisma/client';
import { IPagination } from 'src/interfaces/response.interface';
import { SPRINT_MESSAGE } from 'src/messages';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalesService } from '../locales/locales.service';
import { CreateSprintDto } from './dtos/create-sprint.dto';
import { GetSprintsDto } from './dtos/get-sprints.dto';
import { UpdateSprintDto } from './dtos/update-sprint.dto';
import { SprintsService } from './sprints.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('sprints')
@ApiBearerAuth()
@Controller('sprints')
export class SprintsController {
  constructor(
    private readonly sprintsService: SprintsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.MANAGER])
  async createSprint(
    @Body() createSprintDto: CreateSprintDto,
  ): Promise<{
    message: string;
    data: Sprint;
  }> {
    return {
      message: this.localesService.translate(SPRINT_MESSAGE.CREATE_SPRINT_SUCCESS),
      data: await this.sprintsService.createSprint(createSprintDto),
    };
  }

  @Put(':sprintId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.MANAGER])
  async updateSprint(
    @Param('sprintId') sprintId: number,
    @Body() updateSprintDto: UpdateSprintDto,
  ): Promise<{
    message: string;
    data: Sprint;
  }> {
    return {
      message: this.localesService.translate(SPRINT_MESSAGE.UPDATE_SPRINT_SUCCESS),
      data: await this.sprintsService.updateSprint(
        sprintId,
        updateSprintDto,
      ),
    };
  }

  @Get(':sprintId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.MANAGER])
  async getSprint(
    @Param('sprintId') sprintId: number,
  ): Promise<Sprint> {
    return this.sprintsService.getSprint(sprintId);
  }

  @Delete(':sprintId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.MANAGER])
  async deleteSprint(@Param('sprintId') sprintId: number): Promise<{
    message: string;
    data: Sprint;
  }> {
    return {
      message: this.localesService.translate(SPRINT_MESSAGE.DELETE_SPRINT_SUCCESS),
      data: await this.sprintsService.deleteSprint(sprintId),
    };
  }

  @Get('projects/:projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.MANAGER, EUserRole.USER])
  async getSprints(
    @Query() getSprintsDto: GetSprintsDto,
    @Param('projectId') projectId: number,
  ): Promise<IPagination<Sprint>> {
    return this.sprintsService.getSprints(projectId, getSprintsDto);
  }
}
