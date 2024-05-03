import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging';
import moment from 'moment';

import { IPagination } from 'src/interfaces';
import { DevicesService } from 'src/modules/devices/devices.service';
import { UsersService } from 'src/modules/users/users.service';

import * as firebaseJson from '../../cert/firebase.json';

import { Notification } from '@prisma/client';
import {
  DEVICE_TYPE,
  LIMIT_DEFAULT,
  PAGE_DEFAULT,
  SORT_DEFAULT,
  notificationTranslation,
} from 'src/constants';
import { CommonHelper } from 'src/helpers/common.helper';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { GetNotificationsDto } from './dtos/get-list-notifications.dto';
import { SaveNotificationDto } from './dtos/save-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly deviceService: DevicesService,
    private localsService: LocalesService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: firebaseJson.project_id,
        privateKey: firebaseJson.private_key,
        clientEmail: firebaseJson.client_email,
      }),
    });
  }

  private async sendNotification(
    messages: Message,
    dryRun?: boolean,
  ): Promise<string> {
    try {
      const message = await firebase.messaging().send(messages, dryRun);
      return message;
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async pushNotification(notification: Notification): Promise<void> {
    let devices = await this.deviceService.getAllDevices(notification.userId);
    const notificationAction = notificationTranslation.find(item => item.action === notification.action); 
    if (!devices.length) return;
    devices.map(async (device) => {
      const message: any = {
        notification: {
          title: notificationAction.title,
          body: notificationAction.body,
        },
        token: device.token,
      };
      let referenceUser;
      const data = {
        id: `${notification.id}`,
        action: notification.action,
        createdAt: moment(notification.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        'isRead': `${notification.isRead}`,
        'title': this.localsService.translate(notificationAction.title),
        'body': this.localsService.translate(notificationAction.body),
        referenceUser: referenceUser ? JSON.stringify(referenceUser) : '',
      };
      if (device.deviceType === DEVICE_TYPE.ANDROID) {
        message.android = {
          notification: {
            color: '#E76E26',
            sound: 'default',
            title: this.localsService.translate(notificationAction.title),
            body: this.localsService.translate(notificationAction.body)
          },
          priority: 'high',
          data: data,
        };
      } else if (device.deviceType === DEVICE_TYPE.IOS) {
        message.apns = {
          payload: {
            aps: {
              alert: {
                title: this.localsService.translate(notificationAction.title),
                body: this.localsService.translate(notificationAction.body)
              },
            },
            data: data,
          },
        };
      } else {
        message.webpush = {
          notification: {
            title: notificationAction.title,
            body: notificationAction.body
          },
          data: data,
        };
      }
      await this.sendNotification(message);
    });
  }

  async saveNotifications(
    payload: SaveNotificationDto,
    userIds: number[],
  ): Promise<any> {
    const notifications = userIds.map((userId) => {
      return {
        ...payload,
        userId,
      };
    });
    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  async saveAndPushNotification(
    payload: SaveNotificationDto,
    userIds: number[],
  ): Promise<void> {
    const notifications = await this.saveNotifications(payload, userIds);
    notifications.forEach((notification) => {
      this.pushNotification(notification);
    });
  }

  async getListNotifications(
    userId: number,
    query: GetNotificationsDto,
    lang: string,
  ): Promise<IPagination<Notification>> {
    const { limit = LIMIT_DEFAULT, page = PAGE_DEFAULT, sort } = query;
    const offset = (page - 1) * limit;
    const searchQuery = {};
    const orderBy = sort ? CommonHelper.handleSort(sort) : SORT_DEFAULT;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.notification.count(),
      this.prisma.notification.findMany({
        take: limit,
        skip: offset,
        where: {
          ...searchQuery,
          userId,
        },
        orderBy,
      }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async markAsReadNotifications(userId: number): Promise<void> {}

  async getUnreadNotificationsNumber(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
