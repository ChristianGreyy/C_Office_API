import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'src/constants';
import { EUserRole } from '../enums';

export const AuthDecorator = (specs: EUserRole[]) => SetMetadata(ROLES, specs);
