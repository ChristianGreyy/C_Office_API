/* eslint-disable @typescript-eslint/indent */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Notification, User } from '@prisma/client';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { EUserRole } from 'src/common/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IPagination } from 'src/interfaces';
import { LocalesService } from '../locales/locales.service';
import { GetNotificationsDto } from './dtos/get-list-notifications.dto';
import { NotificationsService } from './notifications.service';
import { NOTIFICATION_MESSAGE } from 'src/messages';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private localesService: LocalesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'API get list notifications' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @ApiHeader({
    name: 'x-lang',
    required: false,
    description: 'Language code',
    example: 'en, vn',
  })
  @Get('')
  @HttpCode(200)
  async getListNotifications(
    @Query() query: GetNotificationsDto,
    @UserDecorator() user: User,
    ): Promise<IPagination<Notification>> {
    return this.notificationsService.getListNotifications(
      user.id,
      query,
      'en',
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'API mark all as read notification profile' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @Put('')
  @HttpCode(200)
  async markAsReadNotifications(
    @UserDecorator() user: User,
  ): Promise<{
    message: string;
  }> {
    await this.notificationsService.markAsReadNotifications(
      user.id,
    );
    return {
      message: this.localesService.translate(
        NOTIFICATION_MESSAGE.MARK_ALL_AS_READ_SUCCESSS,
      ),
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'API get unread notification number' })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @Get('unread-number')
  @HttpCode(200)
  async getUnreadNotificationsNumber(
    @UserDecorator() user: User,
  ): Promise<{
    unreadNumber: number;
  }> {
    const unreadNumber =
      await this.notificationsService.getUnreadNotificationsNumber(
        user.id,
      );
    return {
      unreadNumber,
    };
  }
}
