import type { DataProvider } from '@/lib/providers';
import type { Tournament, TournamentCreate, TournamentUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Tournaments';

export class TournamentRepository extends BaseRepository<Tournament, TournamentCreate, TournamentUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'Tournament',
    });
  }

  protected buildCreateEntity(data: TournamentCreate, now: string): Tournament {
    return {
      id: crypto.randomUUID(),
      name: data.name,
      logo: data.logo,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'DRAFT',
      settings: {
        preliminaryRounds: 5,
        eliminationRounds: 0,
        judgesPerDebate: 3,
        teamSize: 2,
        speakerConfiguration: [],
        rankingRules: { primary: 'wins', tieBreaks: [] },
        tieBreakRules: [],
        ballotConfiguration: {
          requireAllSpeakers: true,
          allowPartialSubmission: false,
          requireComments: false,
        },
        publicVisibility: false,
        ...data.settings,
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: Tournament, query: string): boolean {
    return entity.name.toLowerCase().includes(query);
  }

  async findByStatus(status: string): Promise<Tournament[]> {
    return this.provider.query<Tournament>(this.config.sheetName, { status });
  }
}
