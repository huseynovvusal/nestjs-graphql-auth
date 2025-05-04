import { Role } from 'src/enums/role.enum';

export interface IActiveUser {
  sub: number;
  email: string;
  role: Role;
}
