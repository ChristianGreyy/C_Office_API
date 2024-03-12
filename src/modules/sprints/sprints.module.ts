import { Module, forwardRef } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { SprintsController } from './sprints.controller';
import { SprintsService } from './sprints.service';

@Module({
  imports: [PrismaModule, LocalesModule, 
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [SprintsController],
  providers: [SprintsService],
  exports: [SprintsService],
})
export class SprintsModule {}
