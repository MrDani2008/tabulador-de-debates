import type { DataProvider } from '@/lib/providers';
import type { Institution, InstitutionCreate, InstitutionUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Institutions';

export class InstitutionRepository extends BaseRepository<Institution, InstitutionCreate, InstitutionUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Institution',
    });
  }

  protected buildCreateEntity(data: InstitutionCreate, now: string): Institution {
    return {
      id: crypto.randomUUID(),
      ...data,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Institution, query: string): boolean {
    return (
      entity.name.toLowerCase().includes(query) ||
      entity.shortName.toLowerCase().includes(query) ||
      entity.country.toLowerCase().includes(query)
    );
  }
}
