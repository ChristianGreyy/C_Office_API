import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers';

import { PrismaService } from '../prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device, User } from '@prisma/client';
import { DEVICE_MESSAGE } from 'src/messages';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async registerDevice(
    createDeviceDto: CreateDeviceDto,
    user: User,
  ): Promise<Device> {
    try {
      console.log('device', createDeviceDto);
      let device = await this.prisma.device.findFirst({
        where: {
          userId: user.id,
          deviceId: createDeviceDto.deviceId,
        },
      });
      if (device) {
        if (device.token !== createDeviceDto.token) {
          await this.prisma.device.update({
            where: {
              id: device.id,
            },
            data: createDeviceDto,
          });
          return this.prisma.device.findFirst({
            where: {
              id: device.id,
            },
          });
        }
      } else {
        device = await this.prisma.device.create({
          data: {
            ...createDeviceDto,
            userId: user.id,
          },
        });
      }
      return device;
    } catch (error) {
      console.log('Error in register device: ', error);
      ErrorHelper.BadRequestException(DEVICE_MESSAGE.DEVICE_LOGIN_FAILED);
    }
  }

  async getAllDevices(userId: number): Promise<Device[]> {
    return this.prisma.device.findMany({
      where: {
        userId,
      },
    });
  }

  async getAllDevicesByUserIds(userIds: number[]): Promise<Device[]> {
    return this.prisma.device.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });
  }
}
