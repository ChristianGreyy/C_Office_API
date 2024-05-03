import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { InjectQueue } from '@nestjs/bull';
import { PROCESSOR, QUEUE } from 'src/constants';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  constructor(
      private readonly usersService: UsersService,
      @InjectQueue(QUEUE.COFFICE_QUEUE)
      private readonly cOfficeQueue: Queue,
    ) {}

  // @Cron('*/10 * * * * *')
  async sendNotificaitonForRemindCheckOut() {
    console.log('here')
    const users = await this.usersService.findMany({});
    for(const user of users) {
      await this.cOfficeQueue.add(PROCESSOR.HANDLE_REMIND_CHECK_OUT, {
          userId: user.id
      })
    }
  }
}