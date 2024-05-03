import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';


import { TasksService } from './tasks.service.';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from 'src/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE.COFFICE_QUEUE,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [TasksService],
  exports: [],
})
export class TasksModule { }
