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
import { Issue, User } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { ISSUE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { GetIssuesDto } from './dtos/get-issues.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';
import { IssuesService } from './issues.service';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('issues')
@ApiBearerAuth()
@Controller('issues')
export class IssuesController {
  constructor(
    private readonly issuesService: IssuesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'API Create issue in project' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async createIssue(@Body() createIssueDto: CreateIssueDto,
    @UserDecorator() user: User 
  ): Promise<{
    message: string;
    data: Issue;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.CREATE_ISSUE_SUCCESS,
      ),
      data: await this.issuesService.createIssue(user, createIssueDto),
    };
  }

  @Put(':issueId')
  @ApiOperation({ summary: 'API Update issue' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async updateIssue(
    @Param('issueId') issueId: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<{
    message: string;
    data: Issue;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.UPDATE_ISSUE_SUCCESS,
      ),
      data: await this.issuesService.updateIssue(
        issueId,
        updateIssueDto,
      ),
    };
  }

  @Get(':issueId')
  @ApiOperation({ summary: 'API Get issue' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getIssue(
    @Param('issueId') issueId: number,
    @UserDecorator() user: User
  ): Promise<Issue> {
    return this.issuesService.getIssue(user, issueId);
  }

  @Delete(':issueId')
  @ApiOperation({ summary: 'API Delete issue' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.MANAGER])
  async deleteIssue(@Param('issueId') issueId: number): Promise<{
    message: string;
    data: Issue;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.DELETE_ISSUE_SUCCESS,
      ),
      data: await this.issuesService.deleteIssue(issueId),
    };
  }

  @Get()
  @ApiOperation({ summary: 'API Get all issues' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getIssues(
    @UserDecorator() user: User,
    @Query() getIssuesDto: GetIssuesDto,
  ): Promise<IPagination<Issue>> {
    return this.issuesService.getIssues(user, getIssuesDto);
  }
}
