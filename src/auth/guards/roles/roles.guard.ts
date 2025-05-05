import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator.decorator';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enums/role.enum';

interface RequestWithUser extends Request {
  user: User;
}

interface GqlContext {
  req: RequestWithUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);

    const user = gqlContext.getContext<GqlContext>().req.user;

    const hasRequiredRoles = requiredRoles.some((role) => user.role === role);

    return hasRequiredRoles;
  }
}
