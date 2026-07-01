import type { DataProvider } from '@/lib/providers';
import type { Round, RoundCreate, RoundUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Rounds';

export class RoundRepository extends BaseRepository<Round, RoundCreate, RoundUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Round',
    });
  }

  protected buildCreateEntity(data: RoundCreate, now: string): Round {
    return {
      id: crypto.randomUUID(),
      tournamentId: data.tournamentId,
      number: data.number,
      type: data.type ?? 'PRELIMINARY',
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Round, _query: string): boolean {
    return String(entity.number).includes(_query);
  }

  async findByTournament(tournamentId: string): Promise<Round[]> {
    const all = await this.provider.query<Round>(this.config.sheetName, { tournamentId });
    return all.sort((a, b) => a.number - b.number);
  }

  async findActive(tournamentId: string): Promise<Round | null> {
    const rounds = await this.provider.query<Round>(this.config.sheetName, {
      tournamentId,
      status: 'ACTIVE',
    });
    return rounds[0] ?? null;
  }

  async findByNumber(tournamentId: string, number: number): Promise<Round | null> {
    const rounds = await this.provider.query<Round>(this.config.sheetName, {
      tournamentId,
      number: String(number),
    });
    return rounds[0] ?? null;
  }
}
