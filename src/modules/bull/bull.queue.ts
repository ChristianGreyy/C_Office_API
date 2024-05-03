import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PROCESSOR, QUEUE } from 'src/constants';
import { IQueueHandle } from 'src/interfaces';

import { NotificationsService } from '../notifications/notifications.service';

@Processor(QUEUE.COFFICE_QUEUE)
export class BullQueueProcessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly notificationService: NotificationsService) {}
  @OnQueueActive()
  onActive(job: Job) {
    // console.log(
    //   `Processing job ${job.id} of type ${job.name} with data: ${job.data}...`,
    // );
  }

  @Process(PROCESSOR.QUEUE_HANDLE)
  async handleDelay(job: Job<IQueueHandle>): Promise<boolean> {
    const body = job.data;
    console.log(`Queue with data: ${JSON.stringify(body)}`);
    return true;
  }

  @Process(PROCESSOR.HANDLE_REMIND_CHECK_OUT)
  async handleRemindCheckOut(job: Job<IQueueHandle>): Promise<boolean> {
    const body = job.data;
    await this.notificationService.saveAndPushNotification({
      action: 'reminder'
    }, [job.data['userId']])
    return true;
  }
}
