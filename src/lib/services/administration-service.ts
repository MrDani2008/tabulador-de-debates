import type { User, UserCreate, UserUpdate, Role, RoleCreate, RoleUpdate, AuditLog, AuditLogCreate, SystemSettings, SystemSettingsCreate, SystemSettingsUpdate } from '@/lib/types';
import type { UserRepository } from '@/lib/repositories/user-repository';
import type { RoleRepository } from '@/lib/repositories/role-repository';
import type { AuditLogRepository } from '@/lib/repositories/audit-log-repository';
import type { SystemSettingsRepository } from '@/lib/repositories/system-settings-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class AdministrationService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private auditLogRepository: AuditLogRepository,
    private systemSettingsRepository: SystemSettingsRepository,
  ) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: UserCreate): Promise<User> {
    this.validateUserCreate(data);
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }
    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: UserUpdate): Promise<User> {
    await this.getUserById(id);
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    return this.userRepository.delete(id);
  }

  async listRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role', id);
    }
    return role;
  }

  async createRole(data: RoleCreate): Promise<Role> {
    this.validateRoleCreate(data);
    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new ValidationError('Role with this name already exists');
    }
    return this.roleRepository.create(data);
  }

  async updateRole(id: string, data: RoleUpdate): Promise<Role> {
    await this.getRoleById(id);
    return this.roleRepository.update(id, data);
  }

  async deleteRole(id: string): Promise<void> {
    await this.getRoleById(id);
    return this.roleRepository.delete(id);
  }

  async listAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  async getAuditLogById(id: string): Promise<AuditLog> {
    const log = await this.auditLogRepository.findById(id);
    if (!log) {
      throw new NotFoundError('AuditLog', id);
    }
    return log;
  }

  async createAuditLog(data: AuditLogCreate): Promise<AuditLog> {
    return this.auditLogRepository.create(data);
  }

  async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUser(userId);
  }

  async getAuditLogsByResource(resource: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByResource(resource);
  }

  async getAuditLogsByDateRange(startDate: string, endDate: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByDateRange(startDate, endDate);
  }

  async listSystemSettings(): Promise<SystemSettings[]> {
    return this.systemSettingsRepository.findAll();
  }

  async getSystemSettingsById(id: string): Promise<SystemSettings> {
    const setting = await this.systemSettingsRepository.findById(id);
    if (!setting) {
      throw new NotFoundError('SystemSettings', id);
    }
    return setting;
  }

  async getSystemSettingsByKey(key: string): Promise<SystemSettings | null> {
    return this.systemSettingsRepository.findByKey(key);
  }

  async createSystemSettings(data: SystemSettingsCreate): Promise<SystemSettings> {
    this.validateSystemSettingsCreate(data);
    const existingSetting = await this.systemSettingsRepository.findByKey(data.key);
    if (existingSetting) {
      throw new ValidationError('System setting with this key already exists');
    }
    return this.systemSettingsRepository.create(data);
  }

  async updateSystemSettings(id: string, data: SystemSettingsUpdate): Promise<SystemSettings> {
    await this.getSystemSettingsById(id);
    return this.systemSettingsRepository.update(id, data);
  }

  async deleteSystemSettings(id: string): Promise<void> {
    await this.getSystemSettingsById(id);
    return this.systemSettingsRepository.delete(id);
  }

  async getSystemSettingsByCategory(category: string): Promise<SystemSettings[]> {
    return this.systemSettingsRepository.findByCategory(category);
  }

  private validateUserCreate(data: UserCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.email) {
      errors.email = ['Email is required'];
    } else if (!this.isValidEmail(data.email)) {
      errors.email = ['Invalid email format'];
    }

    if (!data.name) {
      errors.name = ['Name is required'];
    }

    if (!data.role) {
      errors.role = ['Role is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid user data', errors);
    }
  }

  private validateRoleCreate(data: RoleCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.name) {
      errors.name = ['Name is required'];
    }

    if (!data.description) {
      errors.description = ['Description is required'];
    }

    if (!data.permissions || data.permissions.length === 0) {
      errors.permissions = ['At least one permission is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid role data', errors);
    }
  }

  private validateSystemSettingsCreate(data: SystemSettingsCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.key) {
      errors.key = ['Key is required'];
    }

    if (!data.value) {
      errors.value = ['Value is required'];
    }

    if (!data.description) {
      errors.description = ['Description is required'];
    }

    if (!data.category) {
      errors.category = ['Category is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid system settings data', errors);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
