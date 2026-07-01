import type { DataProvider } from '@/lib/providers';
import type { Team, TeamCreate, TeamUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Teams';

export class TeamRepository extends BaseRepository<Team, TeamCreate, TeamUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Team',
    });
  }

  protected buildCreateEntity(data: TeamCreate, now: string): Team {
    return {
      id: crypto.randomUUID(),
      tournamentId: data.tournamentId,
      institutionId: data.institutionId,
      name: data.name,
      code: data.code,
      category: data.category ?? 'OPEN',
      status: 'ACTIVE',
      registrationDate: now,
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Team, query: string): boolean {
    return (
      entity.name.toLowerCase().includes(query) ||
      entity.code.toLowerCase().includes(query)
    );
  }

  async findByTournament(tournamentId: string): Promise<Team[]> {
    return this.provider.query<Team>(this.config.sheetName, { tournamentId });
  }

  async findByInstitution(institutionId: string): Promise<Team[]> {
    return this.provider.query<Team>(this.config.sheetName, { institutionId });
  }

  async findByCategory(category: string): Promise<Team[]> {
    return this.provider.query<Team>(this.config.sheetName, { category });
  }
}
