import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LocalesModule } from './modules/locales/locales.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [LocalesModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
