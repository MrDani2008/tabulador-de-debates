import type { DataProvider } from '@/lib/providers';
import type { AuditLog, AuditLogCreate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'AuditLogs';

export class AuditLogRepository extends BaseRepository<AuditLog, AuditLogCreate, Partial<AuditLogCreate>> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'AuditLog',
    });
  }

  protected buildCreateEntity(data: AuditLogCreate, now: string): AuditLog {
    return {
      id: crypto.randomUUID(),
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: AuditLog, query: string): boolean {
    return (
      entity.action.toLowerCase().includes(query) ||
      entity.resource.toLowerCase().includes(query)
    );
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.provider.query<AuditLog>(this.config.sheetName, { userId });
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    return this.provider.query<AuditLog>(this.config.sheetName, { resource });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<AuditLog[]> {
    const allLogs = await this.findAll();
    return allLogs.filter((log) => {
      const logDate = new Date(log.createdAt);
      return logDate >= new Date(startDate) && logDate <= new Date(endDate);
    });
  }
}
