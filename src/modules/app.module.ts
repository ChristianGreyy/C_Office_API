import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LocalesModule } from './locales/locales.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
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
  ],
})
export class AppModule {}
