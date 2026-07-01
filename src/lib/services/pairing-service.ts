import type { Team, Debate, DebatePositions } from '@/lib/types';
import type { TeamRepository } from '@/lib/repositories/team-repository';
import type { DebateRepository } from '@/lib/repositories/debate-repository';
import { generatePairings, assignPositions, createEmptyHistory } from './pairing-engine';
import type { TeamPairingInput, PairingResult } from './pairing-engine';
import { ValidationError } from '@/lib/errors';

export class PairingService {
  constructor(
    private teamRepository: TeamRepository,
    private debateRepository: DebateRepository,
  ) {}

  async generatePairings(roundId: string, tournamentId: string): Promise<PairingResult> {
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const activeTeams = teams.filter((t) => t.status === 'ACTIVE');

    if (activeTeams.length < 4) {
      throw new ValidationError('At least 4 active teams are required to generate pairings');
    }

    const existingDebates = await this.debateRepository.findByRound(roundId);
    const teamHistoryMap = await this.buildTeamHistory(activeTeams, existingDebates);

    const pairingInputs: TeamPairingInput[] = activeTeams.map((team) => ({
      id: team.id,
      institutionId: team.institutionId,
      history: teamHistoryMap.get(team.id) ?? createEmptyHistory(),
    }));

    const result = generatePairings(pairingInputs);

    const teamMap = new Map(activeTeams.map((t) => [t.id, t as unknown as TeamPairingInput]));
    const assignedPairings = assignPositions(result.pairings, teamMap);

    return {
      pairings: assignedPairings,
      byes: result.byes,
    };
  }

  async savePairings(
    roundId: string,
    tournamentId: string,
    pairings: PairingResult,
  ): Promise<Debate[]> {
    const savedDebates: Debate[] = [];

    for (const pairing of pairings.pairings) {
      const positions: DebatePositions = {
        AG: pairing.positions.AG,
        AO: pairing.positions.AO,
        BG: pairing.positions.BG,
        BO: pairing.positions.BO,
      };

      const debate = await this.debateRepository.create({
        roundId,
        tournamentId,
        positions,
      });

      savedDebates.push(debate);
    }

    return savedDebates;
  }

  private async buildTeamHistory(
    teams: Team[],
    existingDebates: Debate[],
  ): Promise<Map<string, import('./pairing-engine').TeamHistory>> {
    const historyMap = new Map<string, import('./pairing-engine').TeamHistory>();

    for (const team of teams) {
      historyMap.set(team.id, createEmptyHistory());
    }

    for (const debate of existingDebates) {
      const { AG, AO, BG, BO } = debate.positions;
      const allPositions = [AG, AO, BG, BO];

      for (const teamId of allPositions) {
        const history = historyMap.get(teamId);
        if (!history) continue;

        const opponents = allPositions.filter((id) => id !== teamId);
        history.opponents.push(...opponents);

        if (AG === teamId || BG === teamId) {
          history.govCount++;
        } else {
          history.oppCount++;
        }

        if (AG === teamId || AO === teamId) {
          history.openCount++;
        } else {
          history.closeCount++;
        }

        if (AG === teamId) history.positions.AG++;
        if (AO === teamId) history.positions.AO++;
        if (BG === teamId) history.positions.BG++;
        if (BO === teamId) history.positions.BO++;
      }
    }

    return historyMap;
  }
}
