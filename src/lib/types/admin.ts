import type { ID, Timestamps } from './base';
import type { EntityStatus } from '@/config/constants';

export type UserRole = 'ADMIN' | 'TOURNAMENT_DIRECTOR' | 'ADJUDICATOR' | 'TEAM_MEMBER' | 'PUBLIC';

export interface User extends Timestamps {
  id: ID;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: ID;
  status: EntityStatus;
  lastLoginAt?: string;
}

export interface UserCreate {
  email: string;
  name: string;
  role: UserRole;
  institutionId?: ID;
}

export interface UserUpdate {
  name?: string;
  role?: UserRole;
  institutionId?: ID;
  status?: EntityStatus;
}

export interface Role extends Timestamps {
  id: ID;
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleCreate {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

export interface AuditLog extends Timestamps {
  id: ID;
  userId: ID;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogCreate {
  userId: ID;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}

export interface SystemSettings extends Timestamps {
  id: ID;
  key: string;
  value: string;
  description: string;
  category: string;
}

export interface SystemSettingsCreate {
  key: string;
  value: string;
  description: string;
  category: string;
}

export interface SystemSettingsUpdate {
  value?: string;
  description?: string;
  category?: string;
}
