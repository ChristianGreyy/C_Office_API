import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, User } from '@prisma/client';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { IPagination } from 'src/interfaces/response.interface';
import { ISSUE_MESSAGE } from 'src/messages';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalesService } from '../locales/locales.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { GetRequestsDto } from './dtos/get-requests.dto';
import { RequestsService } from './requests.service';
import { UpdateRequestDto } from './dtos/update-request.dto';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('requests')
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'API Create request (over time or absence)' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @UserDecorator() user: User,
  ): Promise<{
    message: string;
    data: Request;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.CREATE_ISSUE_SUCCESS,
      ),
      data: await this.requestsService.createRequest(user, createRequestDto),
    };
  }

  @Put(':requestId')
  @ApiOperation({ summary: 'API Update request (over time or absence)' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF])
  async updateRequest(
    @Param('requestId') requestId: number,
    @Body() updateRequestDto: UpdateRequestDto,
    @UserDecorator() user: User,
  ): Promise<{
    message: string;
    data: Request;
  }> {
    return {
      message: this.localesService.translate(
        ISSUE_MESSAGE.CREATE_ISSUE_SUCCESS,
      ),
      data: await this.requestsService.updateRequest(requestId, user, updateRequestDto),
    };
  }


  @Get()
  @ApiOperation({ summary: 'API Get all requests' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.STAFF, EUserRole.MANAGER])
  async getRequests(
    @UserDecorator() user: User,
    @Query() getRequestsDto: GetRequestsDto,
  ): Promise<IPagination<Request>> {
    return this.requestsService.getRequests(getRequestsDto);
  }
}
