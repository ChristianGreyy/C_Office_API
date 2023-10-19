import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'src/constants';
import { EUserRole } from '../enums';

export const Auth = (specs: EUserRole[]) => SetMetadata(ROLES, specs);
