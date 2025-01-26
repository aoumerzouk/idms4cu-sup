import type { Role } from './permissions';

export interface AppUser {
  id: string;
  email: string;
  roles: Role[];
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  roleIds: string[];
}
