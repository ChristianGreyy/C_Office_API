import { Module, forwardRef } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { LocalesModule } from '../locales/locales.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrioritiesModule } from '../priorities/priorities.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/projects.module';
import { StatusModule } from '../status/status.module';
import { TrackersModule } from '../trackers/trackers.module';
import { UserProjectsModule } from '../user-projects/user-projects.module';
import { UsersModule } from '../users/users.module';
import { EmployeeAttendancesController } from './employee-attendances.controller';
import { EmployeeAttendancesService } from './employee-attendances.service';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => UserProjectsModule),
    forwardRef(() => ProjectsModule),
    forwardRef(() => PrioritiesModule),
    forwardRef(() => TrackersModule),
    forwardRef(() => StatusModule),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [EmployeeAttendancesController],
  providers: [EmployeeAttendancesService],
  exports: [EmployeeAttendancesService],
})
export class EmployeeAttendanceModule {}
