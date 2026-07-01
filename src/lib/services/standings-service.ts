import type { Ballot } from '@/lib/types';
import type { BallotRepository } from '@/lib/repositories/ballot-repository';
import type { TeamRepository } from '@/lib/repositories/team-repository';
import type { InstitutionRepository } from '@/lib/repositories/institution-repository';

export interface TeamStanding {
  rank: number;
  teamId: string;
  teamName: string;
  institutionId: string;
  institutionName: string;
  wins: number;
  losses: number;
  totalPoints: number;
  winRate: number;
  averageSpeakerScore: number;
  totalSpeakerScore: number;
  speakerScoreCount: number;
  govAppearances: number;
  oppAppearances: number;
  tieBreaker: number;
}

export interface SpeakerStanding {
  rank: number;
  speakerId: string;
  speakerName: string;
  teamId: string;
  teamName: string;
  institutionId: string;
  institutionName: string;
  totalScore: number;
  speechCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  tieBreaker: number;
}

export interface InstitutionStanding {
  rank: number;
  institutionId: string;
  institutionName: string;
  teamCount: number;
  teamWins: number;
  teamLosses: number;
  totalPoints: number;
  averageWinRate: number;
  averageSpeakerScore: number;
  tieBreaker: number;
}

export type StandingsType = 'team' | 'speaker' | 'institution';

export interface StandingsResult {
  type: StandingsType;
  standings: TeamStanding[] | SpeakerStanding[] | InstitutionStanding[];
  generatedAt: string;
}

export class StandingsService {
  constructor(
    private ballotRepository: BallotRepository,
    private teamRepository: TeamRepository,
    private institutionRepository: InstitutionRepository,
  ) {}

  async generateTeamStandings(tournamentId: string): Promise<StandingsResult> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const institutions = await this.institutionRepository.findAll();

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const institutionMap = new Map(institutions.map((i) => [i.id, i.name]));

    const standings = this.calculateTeamStandings(approvedBallots, teamMap, institutionMap);
    const rankedStandings = this.rankTeamStandings(standings);

    return {
      type: 'team',
      standings: rankedStandings,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateSpeakerStandings(tournamentId: string): Promise<StandingsResult> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const institutions = await this.institutionRepository.findAll();

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const institutionMap = new Map(institutions.map((i) => [i.id, i.name]));

    const standings = this.calculateSpeakerStandings(approvedBallots, teamMap, institutionMap);
    const rankedStandings = this.rankSpeakerStandings(standings);

    return {
      type: 'speaker',
      standings: rankedStandings,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateInstitutionStandings(tournamentId: string): Promise<StandingsResult> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const institutions = await this.institutionRepository.findAll();

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    const institutionMap = new Map(institutions.map((i) => [i.id, i.name]));

    const standings = this.calculateInstitutionStandings(approvedBallots, teamMap, institutionMap);
    const rankedStandings = this.rankInstitutionStandings(standings);

    return {
      type: 'institution',
      standings: rankedStandings,
      generatedAt: new Date().toISOString(),
    };
  }

  private calculateTeamStandings(
    ballots: Ballot[],
    teamMap: Map<string, { id: string; name: string; institutionId: string }>,
    institutionMap: Map<string, string>,
  ): Map<string, Partial<TeamStanding>> {
    const standings = new Map<string, Partial<TeamStanding>>();

    for (const ballot of ballots) {
      for (const ranking of ballot.rankings) {
        let standing = standings.get(ranking.teamId);
        if (!standing) {
          const team = teamMap.get(ranking.teamId);
          standing = {
            teamId: ranking.teamId,
            teamName: team?.name ?? 'Unknown',
            institutionId: team?.institutionId ?? '',
            institutionName: institutionMap.get(team?.institutionId ?? '') ?? 'Unknown',
            wins: 0,
            losses: 0,
            totalPoints: 0,
            winRate: 0,
            averageSpeakerScore: 0,
            totalSpeakerScore: 0,
            speakerScoreCount: 0,
            govAppearances: 0,
            oppAppearances: 0,
            tieBreaker: 0,
          };
          standings.set(ranking.teamId, standing);
        }

        if (!standing.wins) standing.wins = 0;
        if (!standing.losses) standing.losses = 0;
        if (!standing.totalPoints) standing.totalPoints = 0;
        if (!standing.govAppearances) standing.govAppearances = 0;
        if (!standing.oppAppearances) standing.oppAppearances = 0;

        const isWinner =
          ranking.teamId ===
          ballot.rankings.reduce((best, r) => (r.points > best.points ? r : best)).teamId;

        if (isWinner) {
          standing.wins++;
        } else {
          standing.losses++;
        }

        standing.totalPoints += ranking.points;

        if (ranking.position === 'AG' || ranking.position === 'BG') {
          standing.govAppearances++;
        } else {
          standing.oppAppearances++;
        }
      }

      for (const score of ballot.speakerScores) {
        const standing = standings.get(score.teamId);
        if (standing) {
          if (!standing.totalSpeakerScore) standing.totalSpeakerScore = 0;
          if (!standing.speakerScoreCount) standing.speakerScoreCount = 0;
          standing.totalSpeakerScore += score.score;
          standing.speakerScoreCount++;
        }
      }
    }

    for (const standing of standings.values()) {
      const totalGames = (standing.wins ?? 0) + (standing.losses ?? 0);
      standing.winRate = totalGames > 0 ? (standing.wins ?? 0) / totalGames : 0;
      standing.averageSpeakerScore =
        (standing.speakerScoreCount ?? 0) > 0
          ? (standing.totalSpeakerScore ?? 0) / (standing.speakerScoreCount ?? 0)
          : 0;
      standing.tieBreaker =
        (standing.wins ?? 0) * 1000 + (standing.averageSpeakerScore ?? 0);
    }

    return standings;
  }

  private calculateSpeakerStandings(
    ballots: Ballot[],
    teamMap: Map<string, { id: string; name: string; institutionId: string }>,
    institutionMap: Map<string, string>,
  ): Map<string, Partial<SpeakerStanding>> {
    const standings = new Map<string, Partial<SpeakerStanding>>();

    for (const ballot of ballots) {
      for (const score of ballot.speakerScores) {
        let standing = standings.get(score.speakerId);
        if (!standing) {
          const team = teamMap.get(score.teamId);
          standing = {
            speakerId: score.speakerId,
            speakerName: 'Unknown',
            teamId: score.teamId,
            teamName: team?.name ?? 'Unknown',
            institutionId: team?.institutionId ?? '',
            institutionName: institutionMap.get(team?.institutionId ?? '') ?? 'Unknown',
            totalScore: 0,
            speechCount: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 100,
            tieBreaker: 0,
          };
          standings.set(score.speakerId, standing);
        }

        if (!standing.totalScore) standing.totalScore = 0;
        if (!standing.speechCount) standing.speechCount = 0;
        if (!standing.highestScore) standing.highestScore = 0;
        if (!standing.lowestScore) standing.lowestScore = 100;

        standing.totalScore += score.score;
        standing.speechCount++;
        standing.averageScore = standing.totalScore / standing.speechCount;
        standing.highestScore = Math.max(standing.highestScore, score.score);
        standing.lowestScore = Math.min(standing.lowestScore, score.score);
        standing.tieBreaker = standing.averageScore;
      }
    }

    return standings;
  }

  private calculateInstitutionStandings(
    ballots: Ballot[],
    teamMap: Map<string, { id: string; name: string; institutionId: string }>,
    institutionMap: Map<string, string>,
  ): Map<string, Partial<InstitutionStanding>> {
    const standings = new Map<string, Partial<InstitutionStanding>>();

    const teamStandings = this.calculateTeamStandings(ballots, teamMap, institutionMap);

    for (const [, teamStanding] of teamStandings) {
      const instId = teamStanding.institutionId;
      if (!instId) continue;

      let standing = standings.get(instId);
      if (!standing) {
        standing = {
          institutionId: instId,
          institutionName: teamStanding.institutionName ?? 'Unknown',
          teamCount: 0,
          teamWins: 0,
          teamLosses: 0,
          totalPoints: 0,
          averageWinRate: 0,
          averageSpeakerScore: 0,
          tieBreaker: 0,
        };
        standings.set(instId, standing);
      }

      if (!standing.teamCount) standing.teamCount = 0;
      if (!standing.teamWins) standing.teamWins = 0;
      if (!standing.teamLosses) standing.teamLosses = 0;
      if (!standing.totalPoints) standing.totalPoints = 0;

      standing.teamCount++;
      standing.teamWins += teamStanding.wins ?? 0;
      standing.teamLosses += teamStanding.losses ?? 0;
      standing.totalPoints += teamStanding.totalPoints ?? 0;
    }

    for (const standing of standings.values()) {
      const totalGames = (standing.teamWins ?? 0) + (standing.teamLosses ?? 0);
      standing.averageWinRate = totalGames > 0 ? (standing.teamWins ?? 0) / totalGames : 0;
      standing.tieBreaker =
        (standing.teamWins ?? 0) * 1000 + (standing.totalPoints ?? 0);
    }

    return standings;
  }

  private rankTeamStandings(
    standings: Map<string, Partial<TeamStanding>>,
  ): TeamStanding[] {
    const sorted = Array.from(standings.values()).sort((a, b) => {
      if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
      if ((b.averageSpeakerScore ?? 0) !== (a.averageSpeakerScore ?? 0))
        return (b.averageSpeakerScore ?? 0) - (a.averageSpeakerScore ?? 0);
      return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
    });

    return sorted.map((standing, index) => ({
      rank: index + 1,
      ...standing,
    })) as TeamStanding[];
  }

  private rankSpeakerStandings(
    standings: Map<string, Partial<SpeakerStanding>>,
  ): SpeakerStanding[] {
    const sorted = Array.from(standings.values()).sort((a, b) => {
      if ((b.averageScore ?? 0) !== (a.averageScore ?? 0))
        return (b.averageScore ?? 0) - (a.averageScore ?? 0);
      if ((b.totalScore ?? 0) !== (a.totalScore ?? 0))
        return (b.totalScore ?? 0) - (a.totalScore ?? 0);
      return (b.highestScore ?? 0) - (a.highestScore ?? 0);
    });

    return sorted.map((standing, index) => ({
      rank: index + 1,
      ...standing,
    })) as SpeakerStanding[];
  }

  private rankInstitutionStandings(
    standings: Map<string, Partial<InstitutionStanding>>,
  ): InstitutionStanding[] {
    const sorted = Array.from(standings.values()).sort((a, b) => {
      if ((b.averageWinRate ?? 0) !== (a.averageWinRate ?? 0))
        return (b.averageWinRate ?? 0) - (a.averageWinRate ?? 0);
      return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
    });

    return sorted.map((standing, index) => ({
      rank: index + 1,
      ...standing,
    })) as InstitutionStanding[];
  }
}
