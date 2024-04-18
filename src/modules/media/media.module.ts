import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadsModule } from '../uploads/upload.module';
import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { LocalesModule } from '../locales/locales.module';

@Module({
  imports: [
    PrismaModule,
    UploadsModule,
    UsersModule,
    PermissionsModule,
    LocalesModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
