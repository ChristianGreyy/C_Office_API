import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './Tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { EmployeeAttendanceModule } from './employee-attendances/employee-attendances.module';
import { IssuesModule } from './issues/issues.module';
import { LevelsModule } from './levels/levels.module';
import { LocalesModule } from './locales/locales.module';
import { MediaModule } from './media/media.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PositionsModule } from './positions/positions.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { RequestModule } from './requests/requests.module';
import { RolesModule } from './roles/roles.module';
import { SprintsModule } from './sprints/sprints.module';
import { StatusModule } from './status/status.module';
import { TrackersModule } from './trackers/trackers.module';
import { UniversitiesModule } from './universities/universities.module';
import { UploadsModule } from './uploads/upload.module';
import { UsersModule } from './users/users.module';
import { BullQueueModule } from './bull/bull.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [    
    ScheduleModule.forRoot(),
    BullQueueModule,
    PrismaModule,
    LocalesModule,
    NodemailerModule,
    AuthModule,
    PermissionsModule,
    UsersModule,
    RolesModule,
    PositionsModule,
    LevelsModule,
    UniversitiesModule,
    TrackersModule,
    PrioritiesModule,
    StatusModule,
    ProjectsModule,
    SprintsModule,
    IssuesModule,
    EmployeeAttendanceModule,
    UploadsModule,
    MediaModule,
    DevicesModule,
    NotificationsModule,
    RequestModule,
    TasksModule,
    WebSocketModule
  ],
})
export class AppModule {}
