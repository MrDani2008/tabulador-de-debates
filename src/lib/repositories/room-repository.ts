import type { DataProvider } from '@/lib/providers';
import type { Room, RoomCreate, RoomUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Rooms';

export class RoomRepository extends BaseRepository<Room, RoomCreate, RoomUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Room',
    });
  }

  protected buildCreateEntity(data: RoomCreate, now: string): Room {
    return {
      id: crypto.randomUUID(),
      venueId: data.venueId,
      tournamentId: data.tournamentId,
      name: data.name,
      capacity: data.capacity ?? 8,
      accessibilityNotes: data.accessibilityNotes,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Room, query: string): boolean {
    return entity.name.toLowerCase().includes(query);
  }

  async findByVenue(venueId: string): Promise<Room[]> {
    return this.provider.query<Room>(this.config.sheetName, { venueId });
  }

  async findByTournament(tournamentId: string): Promise<Room[]> {
    return this.provider.query<Room>(this.config.sheetName, { tournamentId });
  }
}
