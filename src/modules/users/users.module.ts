import { Module, forwardRef } from '@nestjs/common';
import { LevelsModule } from '../levels/levels.module';
import { LocalesModule } from '../locales/locales.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PositionsModule } from '../positions/positions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UniversitiesModule } from '../universities/universities.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => PermissionsModule),
    forwardRef(() => NodemailerModule),
    forwardRef(() => PositionsModule),
    forwardRef(() => UniversitiesModule),
    forwardRef(() => LevelsModule),
    forwardRef(() => IssuesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
