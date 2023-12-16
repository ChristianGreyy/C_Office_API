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

@Module({
  imports: [
    PrismaModule,
    LocalesModule,
    forwardRef(() => PermissionsModule),
    forwardRef(() => NodemailerModule),
    forwardRef(() => PositionsModule),
    forwardRef(() => UniversitiesModule),
    forwardRef(() => LevelsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
