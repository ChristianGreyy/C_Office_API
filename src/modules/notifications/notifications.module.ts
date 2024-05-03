import { Module, forwardRef } from '@nestjs/common';
import { DevicesModule } from 'src/modules/devices/devices.module';
import { UsersModule } from 'src/modules/users/users.module';


import { LocalesModule } from '../locales/locales.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    DevicesModule,
    LocalesModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule { }
