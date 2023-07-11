import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';

export const ROLES_DATA = 'roles';

export const Roles = (...args: ValidRoles[]) => SetMetadata(ROLES_DATA, args);
