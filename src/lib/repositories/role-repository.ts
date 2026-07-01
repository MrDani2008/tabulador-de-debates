import type { DataProvider } from '@/lib/providers';
import type { Role, RoleCreate, RoleUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Roles';

export class RoleRepository extends BaseRepository<Role, RoleCreate, RoleUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Role',
    });
  }

  protected buildCreateEntity(data: RoleCreate, now: string): Role {
    return {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Role, query: string): boolean {
    return entity.name.toLowerCase().includes(query);
  }

  async findByName(name: string): Promise<Role | null> {
    const roles = await this.provider.query<Role>(this.config.sheetName, { name });
    return roles[0] ?? null;
  }
}
