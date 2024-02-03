import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LocalesModule } from './modules/locales/locales.module';
import { NodemailerModule } from './modules/nodemailer/nodemailer.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PrioritiesModule } from './modules/priorities/priorities.module';
import { RolesModule } from './modules/roles/roles.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    LocalesModule,
    NodemailerModule,
    AuthModule,
    PermissionsModule,
    UsersModule,
    RolesModule,
    UniversitiesModule,
    PrioritiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
