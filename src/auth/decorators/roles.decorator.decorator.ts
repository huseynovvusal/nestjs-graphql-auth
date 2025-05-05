import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';

export const RolesDecorator = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
