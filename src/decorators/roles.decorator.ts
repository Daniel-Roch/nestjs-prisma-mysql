import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

//setMetadata cria um objeto com algum argumento
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
