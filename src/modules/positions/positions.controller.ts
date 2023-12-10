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
import { Position } from '@prisma/client';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { PermissionDecorator } from 'src/common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from 'src/common/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { POSITION_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { GetPositionsDto } from './dtos/get-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { PositionsService } from './positions.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('positions')
@ApiBearerAuth()
@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_POSITION)
  async createPosition(@Body() createPositionDto: CreatePositionDto): Promise<{
    message: string;
    data: Position;
  }> {
    return {
      message: this.localesService.translate(
        POSITION_MESSAGE.CREATE_POSITION_SUCCESS,
      ),
      data: await this.positionsService.createPosition(createPositionDto),
    };
  }

  @Put(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_POSITION)
  async updatePosition(
    @Param('positionId') positionId: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<{
    message: string;
    data: Position;
  }> {
    return {
      message: this.localesService.translate(
        POSITION_MESSAGE.UPDATE_POSITION_SUCCESS,
      ),
      data: await this.positionsService.updatePosition(
        positionId,
        updatePositionDto,
      ),
    };
  }

  @Get(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_POSITION)
  async getPosition(
    @Param('positionId') positionId: number,
  ): Promise<Position> {
    return this.positionsService.getPosition(positionId);
  }

  @Delete(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_POSITION)
  async deletePosition(@Param('positionId') positionId: number): Promise<{
    message: string;
    data: Position;
  }> {
    return {
      message: this.localesService.translate(
        POSITION_MESSAGE.UPDATE_POSITION_SUCCESS,
      ),
      data: await this.positionsService.deletePosition(positionId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_POSITIONS)
  async getPositions(
    @Query() getPositionsDto: GetPositionsDto,
  ): Promise<IPagination<Position>> {
    return this.positionsService.getPositions(getPositionsDto);
  }
}
