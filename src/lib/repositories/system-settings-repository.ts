import type { DataProvider } from '@/lib/providers';
import type { SystemSettings, SystemSettingsCreate, SystemSettingsUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'SystemSettings';

export class SystemSettingsRepository extends BaseRepository<SystemSettings, SystemSettingsCreate, SystemSettingsUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'SystemSettings',
    });
  }

  protected buildCreateEntity(data: SystemSettingsCreate, now: string): SystemSettings {
    return {
      id: crypto.randomUUID(),
      key: data.key,
      value: data.value,
      description: data.description,
      category: data.category,
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: SystemSettings, query: string): boolean {
    return (
      entity.key.toLowerCase().includes(query) ||
      entity.description.toLowerCase().includes(query)
    );
  }

  async findByKey(key: string): Promise<SystemSettings | null> {
    const settings = await this.provider.query<SystemSettings>(this.config.sheetName, { key });
    return settings[0] ?? null;
  }

  async findByCategory(category: string): Promise<SystemSettings[]> {
    return this.provider.query<SystemSettings>(this.config.sheetName, { category });
  }
}
