import { Module } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, UsersModule, LocalesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
