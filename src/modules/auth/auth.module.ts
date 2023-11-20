import { Module } from '@nestjs/common';
import { LocalesModule } from '../locales/locales.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from 'src/constants';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: JWT.SECRET,
      signOptions: { expiresIn: JWT.EXPIRES_IN },
    }),
    UsersModule,
    LocalesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
