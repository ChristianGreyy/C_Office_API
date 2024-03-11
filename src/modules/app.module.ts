import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { LevelsModule } from './levels/levels.module';
import { LocalesModule } from './locales/locales.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PositionsModule } from './positions/positions.module';
import { PrioritiesModule } from './priorities/priorities.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { StatusModule } from './status/status.module';
import { TrackersModule } from './trackers/trackers.module';
import { UniversitiesModule } from './universities/universities.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
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
    CategoriesModule,
    ProjectsModule,
  ],
})
export class AppModule {}
