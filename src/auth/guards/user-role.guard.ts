import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { ROLES_DATA } from '../docorators/roles.decorator';

@Injectable()
export class UserRoleGuardGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      ROLES_DATA,
      context.getHandler(),
    );

    //Recupero user del request
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user) throw new BadRequestException('User not found');

    if (!roles || roles.length === 0) return true;

    if (user.roles.some((r) => roles.includes(r))) return true;

    throw new ForbiddenException(
      `User: ${user.name} needs valid roles: ${roles}`,
    );
  }
}
