import type { DataProvider } from '@/lib/providers';
import type { Adjudicator, AdjudicatorCreate, AdjudicatorUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Adjudicators';

export class AdjudicatorRepository extends BaseRepository<Adjudicator, AdjudicatorCreate, AdjudicatorUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Adjudicator',
    });
  }

  protected buildCreateEntity(data: AdjudicatorCreate, now: string): Adjudicator {
    return {
      id: crypto.randomUUID(),
      tournamentId: data.tournamentId,
      institutionId: data.institutionId,
      fullName: data.fullName,
      category: data.category ?? 'PANELIST',
      experience: data.experience ?? 'INTERMEDIATE',
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Adjudicator, query: string): boolean {
    return entity.fullName.toLowerCase().includes(query);
  }

  async findByTournament(tournamentId: string): Promise<Adjudicator[]> {
    return this.provider.query<Adjudicator>(this.config.sheetName, { tournamentId });
  }

  async findByInstitution(institutionId: string): Promise<Adjudicator[]> {
    return this.provider.query<Adjudicator>(this.config.sheetName, { institutionId });
  }

  async findByCategory(category: string): Promise<Adjudicator[]> {
    return this.provider.query<Adjudicator>(this.config.sheetName, { category });
  }
}
