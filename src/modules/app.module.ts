import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LevelsModule } from './levels/levels.module';
import { LocalesModule } from './locales/locales.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PositionsModule } from './positions/positions.module';
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
    PositionsModule,
    LevelsModule,
  ],
})
export class AppModule {}
