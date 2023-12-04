import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS } from 'src/constants';
import { EUserPermission } from '../enums';

export const PermissionDecorator = (specs: EUserPermission) =>
  SetMetadata(PERMISSIONS, specs);
