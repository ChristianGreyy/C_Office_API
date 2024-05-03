import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserProjectsModule } from '../user-projects/user-projects.module';
import { UsersModule } from '../users/users.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => UserProjectsModule),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestModule {}
