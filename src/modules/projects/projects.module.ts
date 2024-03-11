import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UserProjectsModule } from '../user-projects/user-projects.module';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => UserProjectsModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
