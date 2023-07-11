import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { Roles } from './roles.decorator';
import { UserRoleGuardGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard(), UserRoleGuardGuard),
  );
}
