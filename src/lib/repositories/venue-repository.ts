import type { DataProvider } from '@/lib/providers';
import type { Venue, VenueCreate, VenueUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Venues';

export class VenueRepository extends BaseRepository<Venue, VenueCreate, VenueUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Venue',
    });
  }

  protected buildCreateEntity(data: VenueCreate, now: string): Venue {
    return {
      id: crypto.randomUUID(),
      tournamentId: data.tournamentId,
      name: data.name,
      address: data.address,
      description: data.description,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Venue, query: string): boolean {
    return entity.name.toLowerCase().includes(query);
  }

  async findByTournament(tournamentId: string): Promise<Venue[]> {
    return this.provider.query<Venue>(this.config.sheetName, { tournamentId });
  }
}
