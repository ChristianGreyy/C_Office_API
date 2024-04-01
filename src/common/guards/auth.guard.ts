import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT, PERMISSIONS, ROLES } from 'src/constants';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { UsersService } from 'src/modules/users/users.service';
import { EUserRole } from '../enums';
import { ErrorHelper } from 'src/helpers';
import { LocalesService } from 'src/modules/locales/locales.service';
import { AUTH_MESSAGE } from 'src/messages/auth.message';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PermissionsService))
    private readonly permissionsService: PermissionsService,
    @Inject(forwardRef(() => LocalesService))
    private localesService: LocalesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(ROLES, context.getHandler());
    const permission = this.reflector.get(PERMISSIONS, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: JWT.SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne({
      where: {
        id: payload.sub,
      },
      include: {
        role: true,
      },
    });
    if (!user || !roles.includes(user?.['role']?.name)) {
      throw new UnauthorizedException();
    }
    // role admin
    if (roles.length === 1 && roles.includes(EUserRole.ADMIN)) {
      const checkPermission = await this.permissionsService.findOne({
        where: {
          slug: permission,
        },
      });
      if (
        checkPermission &&
        user?.['role']?.['permissionIds']?.includes(checkPermission.id)
      ) {
        return true;
      } else {
        ErrorHelper.NotFoundException(
          this.localesService.translate(AUTH_MESSAGE.NO_PERMISSION),
        );
        return false;
      }
    }
    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
