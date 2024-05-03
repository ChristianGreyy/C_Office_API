import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserProfileGateway } from './gateway/user.gateway';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [UserProfileGateway],
  exports: [UserProfileGateway]
})
export class WebSocketModule { }
