/* eslint-disable @typescript-eslint/indent */
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { EUserRole } from 'src/common/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { User, Device } from '@prisma/client';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'API register fcmToken' })
  @ApiBody({
    required: true,
    type: CreateDeviceDto,
    description: 'API register fcmToken',
  })
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.USER])
  @Post('register')
  @HttpCode(201)
  async registerDevice(
    @Body() payload: CreateDeviceDto,
    @UserDecorator() user: User,
  ): Promise<Device> {
    return this.devicesService.registerDevice(payload, user);
  }
}
