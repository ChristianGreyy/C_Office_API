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
import { University } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { UNIVERSITY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateUniversityDto } from './dtos/create-university.dto';
import { GetUniversitiesDto } from './dtos/get-university.dto';
import { UpdateUniversityDto } from './dtos/update-university.dto';
import { UniversitiesService } from './universities.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('universities')
@ApiBearerAuth()
@Controller('universities')
export class UniversitiesController {
  constructor(
    private readonly universitiesService: UniversitiesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_UNIVERSITY)
  async createUniversity(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<{
    message: string;
    data: University;
  }> {
    return {
      message: this.localesService.translate(
        UNIVERSITY_MESSAGE.CREATE_UNIVERSITY_SUCCESS,
      ),
      data: await this.universitiesService.createUniversity(
        createUniversityDto,
      ),
    };
  }

  @Put(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_UNIVERSITY)
  async updateUniversity(
    @Param('positionId') positionId: number,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ): Promise<{
    message: string;
    data: University;
  }> {
    return {
      message: this.localesService.translate(
        UNIVERSITY_MESSAGE.UPDATE_UNIVERSITY_SUCCESS,
      ),
      data: await this.universitiesService.updateUniversity(
        positionId,
        updateUniversityDto,
      ),
    };
  }

  @Get(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_UNIVERSITY)
  async getUniversity(
    @Param('positionId') positionId: number,
  ): Promise<University> {
    return this.universitiesService.getUniversity(positionId);
  }

  @Delete(':positionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_UNIVERSITY)
  async deleteUniversity(@Param('positionId') positionId: number): Promise<{
    message: string;
    data: University;
  }> {
    return {
      message: this.localesService.translate(
        UNIVERSITY_MESSAGE.DELETE_UNIVERSITY_SUCCESS,
      ),
      data: await this.universitiesService.deleteUniversity(positionId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_UNIVERSITIES)
  async getUniversities(
    @Query() getUniversitiesDto: GetUniversitiesDto,
  ): Promise<IPagination<University>> {
    return this.universitiesService.getUniversities(getUniversitiesDto);
  }
}
