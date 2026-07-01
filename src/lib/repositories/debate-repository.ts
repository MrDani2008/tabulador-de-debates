import type { DataProvider } from '@/lib/providers';
import type { Debate, DebateCreate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Debates';

export class DebateRepository extends BaseRepository<Debate, DebateCreate, Partial<Debate>> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Debate',
    });
  }

  protected buildCreateEntity(data: DebateCreate, now: string): Debate {
    return {
      id: crypto.randomUUID(),
      roundId: data.roundId,
      tournamentId: data.tournamentId,
      roomId: data.roomId,
      positions: data.positions,
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(): boolean {
    return false;
  }

  async findByRound(roundId: string): Promise<Debate[]> {
    return this.provider.query<Debate>(this.config.sheetName, { roundId });
  }

  async findByTournament(tournamentId: string): Promise<Debate[]> {
    return this.provider.query<Debate>(this.config.sheetName, { tournamentId });
  }

  async findByTeam(teamId: string): Promise<Debate[]> {
    const all = await this.findAll();
    return all.filter(
      (d) =>
        d.positions.AG === teamId ||
        d.positions.AO === teamId ||
        d.positions.BG === teamId ||
        d.positions.BO === teamId,
    );
  }
}
