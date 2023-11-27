import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from 'src/constants';
import { LocalesModule } from '../locales/locales.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: JWT.SECRET,
      signOptions: { expiresIn: JWT.EXPIRES_IN },
    }),
    NodemailerModule,
    UsersModule,
    LocalesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
