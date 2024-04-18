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
import { Project, User } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { PROJECT_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { GetProjectsDto } from './dtos/get-projects.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectsService } from './projects.service';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UpdateProjectMembersDto } from './dtos/update-project-members.dto';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @UserDecorator('id') userId: number,
  ): Promise<{
    message: string;
    data: Project;
  }> {
    return {
      message: this.localesService.translate(
        PROJECT_MESSAGE.CREATE_PROJECT_SUCCESS,
      ),
      data: await this.projectsService.createProject(userId, createProjectDto),
    };
  }

  @Put(':projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<{
    message: string;
    data: Project;
  }> {
    return {
      message: this.localesService.translate(
        PROJECT_MESSAGE.UPDATE_PROJECT_SUCCESS,
      ),
      data: await this.projectsService.updateProject(
        projectId,
        updateProjectDto,
      ),
    };
  }

  @Get('members/:projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getMembersForProject(
    @Param('projectId') projectId: number,
  ): Promise<any> {
    return this.projectsService.getMembersForProject(projectId);
  }

  @Put('members/:projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async updateMembersForProject(
    @Param('projectId') projectId: number,
    @Body() updateProjectDto: UpdateProjectMembersDto,
  ): Promise<{
    message: string;
    data: Project;
  }> {
    return {
      message: this.localesService.translate(
        PROJECT_MESSAGE.UPDATE_MEMBERS_SUCCESS,
      ),
      data: await this.projectsService.updateMembersForProject(
        projectId,
        updateProjectDto,
      ),
    };
  }

  @Get(':projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  async getProject(
    @Param('projectId') projectId: number,
    @UserDecorator() user: User,
  ): Promise<Project> {
    return this.projectsService.getProject(user, projectId);
  }

  @Delete(':projectId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  async deleteProject(@Param('projectId') projectId: number): Promise<{
    message: string;
    data: Project;
  }> {
    return {
      message: this.localesService.translate(
        PROJECT_MESSAGE.UPDATE_PROJECT_SUCCESS,
      ),
      data: await this.projectsService.deleteProject(projectId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getProjects(
    @UserDecorator() user: User,
    @Query() getProjectsDto: GetProjectsDto,
  ): Promise<IPagination<Project>> {
    return this.projectsService.getProjects(user, getProjectsDto);
  }
}
