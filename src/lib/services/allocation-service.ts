import type { Debate } from '@/lib/types';
import type { AdjudicatorRepository } from '@/lib/repositories/adjudicator-repository';
import type { ConflictRepository } from '@/lib/repositories/conflict-repository';
import type { DebateRepository } from '@/lib/repositories/debate-repository';
import { allocateAdjudicators } from './allocation-engine';
import type { AdjudicatorInput, DebateInput, ConflictInput, AllocationResult } from './allocation-engine';
import { ValidationError } from '@/lib/errors';

export class AllocationService {
  constructor(
    private adjudicatorRepository: AdjudicatorRepository,
    private conflictRepository: ConflictRepository,
    private debateRepository: DebateRepository,
  ) {}

  async allocate(tournamentId: string, roundId: string, panelSize: number = 3): Promise<AllocationResult[]> {
    const adjudicators = await this.adjudicatorRepository.findByTournament(tournamentId);
    const activeAdjudicators = adjudicators.filter((a) => a.status === 'ACTIVE');

    if (activeAdjudicators.length === 0) {
      throw new ValidationError('No active adjudicators available for allocation');
    }

    const debates = await this.debateRepository.findByRound(roundId);
    if (debates.length === 0) {
      throw new ValidationError('No debates found for this round');
    }

    const allConflicts = await this.conflictRepository.findAll();

    const adjInputs: AdjudicatorInput[] = activeAdjudicators.map((a) => ({
      id: a.id,
      institutionId: a.institutionId,
      category: a.category,
      experience: a.experience,
      workload: 0,
    }));

    const debateInputs: DebateInput[] = debates.map((d) => ({
      id: d.id,
      teamInstitutionIds: this.getTeamInstitutionIds(d),
    }));

    const conflictInputs: ConflictInput[] = allConflicts.map((c) => ({
      adjudicatorId: c.adjudicatorId,
      targetId: c.targetId,
      conflictType: c.conflictType,
    }));

    return allocateAdjudicators(adjInputs, debateInputs, conflictInputs, panelSize);
  }

  private getTeamInstitutionIds(debate: Debate): string[] {
    return [
      debate.positions.AG,
      debate.positions.AO,
      debate.positions.BG,
      debate.positions.BO,
    ].filter(Boolean);
  }
}
