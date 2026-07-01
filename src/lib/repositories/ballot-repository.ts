import type { DataProvider } from '@/lib/providers';
import type { Ballot, BallotCreate, BallotUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Ballots';

export class BallotRepository extends BaseRepository<Ballot, BallotCreate, BallotUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Ballot',
    });
  }

  protected buildCreateEntity(data: BallotCreate, now: string): Ballot {
    return {
      id: crypto.randomUUID(),
      debateId: data.debateId,
      roundId: data.roundId,
      tournamentId: data.tournamentId,
      rankings: data.rankings,
      speakerScores: data.speakerScores,
      comments: data.comments,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(): boolean {
    return false;
  }

  async findByDebate(debateId: string): Promise<Ballot | null> {
    const ballots = await this.provider.query<Ballot>(this.config.sheetName, { debateId });
    return ballots[0] ?? null;
  }

  async findByRound(roundId: string): Promise<Ballot[]> {
    return this.provider.query<Ballot>(this.config.sheetName, { roundId });
  }

  async findByTournament(tournamentId: string): Promise<Ballot[]> {
    return this.provider.query<Ballot>(this.config.sheetName, { tournamentId });
  }
}
