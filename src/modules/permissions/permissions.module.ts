import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [PrismaModule, LocalesModule, forwardRef(() => UsersModule)],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
