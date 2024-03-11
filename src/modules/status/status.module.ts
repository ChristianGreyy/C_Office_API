import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
