import { Module, forwardRef } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { LocalesModule } from '../locales/locales.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    LocalesModule
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule { }
