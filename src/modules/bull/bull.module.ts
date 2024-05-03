import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import {
  PREFIX_KEY,
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from 'src/constants';

import { NotificationsModule } from '../notifications/notifications.module';

import { BullQueueProcessor } from './bull.queue';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          password: REDIS_PASSWORD,
          db: REDIS_DB,
          keyPrefix: PREFIX_KEY,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          timeout: 30000,
          attempts: 3,
          backoff: 3000,
          delay: 1000,
          stackTraceLimit: 10,
        },
        prefix: PREFIX_KEY,
      }),
    }),
    NotificationsModule,
  ],
  providers: [BullQueueProcessor],
})
export class BullQueueModule { }
