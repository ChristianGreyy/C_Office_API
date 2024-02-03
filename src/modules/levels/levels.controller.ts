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
import { Level } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { LEVEL_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateLevelDto } from './dtos/create-level.dto';
import { GetLevelsDto } from './dtos/get-level.dto';
import { UpdateLevelDto } from './dtos/update-level.dto';
import { LevelsService } from './levels.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('levels')
@ApiBearerAuth()
@Controller('levels')
export class LevelsController {
  constructor(
    private readonly levelsService: LevelsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_LEVEL)
  async createLevel(@Body() createLevelDto: CreateLevelDto): Promise<{
    message: string;
    data: Level;
  }> {
    return {
      message: this.localesService.translate(
        LEVEL_MESSAGE.CREATE_LEVEL_SUCCESS,
      ),
      data: await this.levelsService.createLevel(createLevelDto),
    };
  }

  @Put(':levelId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_LEVEL)
  async updateLevel(
    @Param('levelId') levelId: number,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<{
    message: string;
    data: Level;
  }> {
    return {
      message: this.localesService.translate(
        LEVEL_MESSAGE.UPDATE_LEVEL_SUCCESS,
      ),
      data: await this.levelsService.updateLevel(levelId, updateLevelDto),
    };
  }

  @Get(':levelId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_LEVEL)
  async getLevel(@Param('levelId') levelId: number): Promise<Level> {
    return this.levelsService.getLevel(levelId);
  }

  @Delete(':levelId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_LEVEL)
  async deleteLevel(@Param('levelId') levelId: number): Promise<{
    message: string;
    data: Level;
  }> {
    return {
      message: this.localesService.translate(
        LEVEL_MESSAGE.UPDATE_LEVEL_SUCCESS,
      ),
      data: await this.levelsService.deleteLevel(levelId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_LEVELS)
  async getLevels(
    @Query() getLevelsDto: GetLevelsDto,
  ): Promise<IPagination<Level>> {
    return this.levelsService.getLevels(getLevelsDto);
  }
}
