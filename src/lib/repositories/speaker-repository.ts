import type { DataProvider } from '@/lib/providers';
import type { Speaker, SpeakerCreate, SpeakerUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Speakers';

export class SpeakerRepository extends BaseRepository<Speaker, SpeakerCreate, SpeakerUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Speaker',
    });
  }

  protected buildCreateEntity(data: SpeakerCreate, now: string): Speaker {
    return {
      id: crypto.randomUUID(),
      teamId: data.teamId,
      institutionId: data.institutionId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Speaker, query: string): boolean {
    return entity.fullName.toLowerCase().includes(query);
  }

  async findByTeam(teamId: string): Promise<Speaker[]> {
    return this.provider.query<Speaker>(this.config.sheetName, { teamId });
  }

  async findByInstitution(institutionId: string): Promise<Speaker[]> {
    return this.provider.query<Speaker>(this.config.sheetName, { institutionId });
  }

  async findByTournament(tournamentId: string): Promise<Speaker[]> {
    return this.provider.query<Speaker>(this.config.sheetName, { tournamentId });
  }
}
