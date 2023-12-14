import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
