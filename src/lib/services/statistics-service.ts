import type { Ballot } from '@/lib/types';
import type { BallotRepository } from '@/lib/repositories/ballot-repository';
import type { TeamRepository } from '@/lib/repositories/team-repository';
import type { SpeakerRepository } from '@/lib/repositories/speaker-repository';
import type { AdjudicatorRepository } from '@/lib/repositories/adjudicator-repository';
import type { RoomRepository } from '@/lib/repositories/room-repository';
import type { DebateRepository } from '@/lib/repositories/debate-repository';
import type { RoundRepository } from '@/lib/repositories/round-repository';

export interface TeamStatistics {
  teamId: string;
  teamName: string;
  institutionId: string;
  totalDebates: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPoints: number;
  averagePoints: number;
  totalSpeakerScore: number;
  averageSpeakerScore: number;
  govDebates: number;
  oppDebates: number;
  govWinRate: number;
  oppWinRate: number;
  firstPlaceFinishes: number;
  secondPlaceFinishes: number;
  thirdPlaceFinishes: number;
  fourthPlaceFinishes: number;
}

export interface SpeakerStatistics {
  speakerId: string;
  speakerName: string;
  teamId: string;
  teamName: string;
  institutionId: string;
  totalSpeeches: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;
  standardDeviation: number;
  scores: number[];
}

export interface JudgeStatistics {
  adjudicatorId: string;
  adjudicatorName: string;
  institutionId: string;
  totalDebatesJudged: number;
  averagePanelSize: number;
  uniqueTeamsJudged: number;
  uniqueSpeakersJudged: number;
  averageBallotScore: number;
  consistencyScore: number;
}

export interface RoomStatistics {
  roomId: string;
  roomName: string;
  venueId: string;
  venueName: string;
  totalDebates: number;
  averageAttendance: number;
  utilizationRate: number;
}

export interface TournamentStatistics {
  tournamentId: string;
  tournamentName: string;
  totalRounds: number;
  totalDebates: number;
  totalTeams: number;
  totalSpeakers: number;
  totalAdjudicators: number;
  totalVenues: number;
  totalRooms: number;
  averageDebatesPerRound: number;
  averagePanelSize: number;
  averageSpeakerScore: number;
  highestScoringDebate: string;
  lowestScoringDebate: string;
}

export class StatisticsService {
  constructor(
    private ballotRepository: BallotRepository,
    private teamRepository: TeamRepository,
    private speakerRepository: SpeakerRepository,
    private adjudicatorRepository: AdjudicatorRepository,
    private roomRepository: RoomRepository,
    private debateRepository: DebateRepository,
    private roundRepository: RoundRepository,
  ) {}

  async getTeamStatistics(tournamentId: string, teamId: string): Promise<TeamStatistics> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
      throw new Error('Team not found');
    }

    return this.calculateTeamStatistics(teamId, team.name, team.institutionId, approvedBallots);
  }

  async getSpeakerStatistics(tournamentId: string, speakerId: string): Promise<SpeakerStatistics> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const speakers = await this.speakerRepository.findByTournament(tournamentId);
    const speaker = speakers.find((s) => s.id === speakerId);

    if (!speaker) {
      throw new Error('Speaker not found');
    }

    return this.calculateSpeakerStatistics(
      speakerId,
      speaker.fullName,
      speaker.teamId,
      '',
      '',
      approvedBallots,
    );
  }

  async getJudgeStatistics(adjudicatorId: string): Promise<JudgeStatistics> {
    const adjudicator = await this.adjudicatorRepository.findById(adjudicatorId);
    if (!adjudicator) {
      throw new Error('Adjudicator not found');
    }

    return {
      adjudicatorId,
      adjudicatorName: adjudicator.fullName,
      institutionId: adjudicator.institutionId,
      totalDebatesJudged: 0,
      averagePanelSize: 0,
      uniqueTeamsJudged: 0,
      uniqueSpeakersJudged: 0,
      averageBallotScore: 0,
      consistencyScore: 0,
    };
  }

  async getRoomStatistics(roomId: string): Promise<RoomStatistics> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return {
      roomId,
      roomName: room.name,
      venueId: room.venueId,
      venueName: '',
      totalDebates: 0,
      averageAttendance: 0,
      utilizationRate: 0,
    };
  }

  async getTournamentStatistics(tournamentId: string): Promise<TournamentStatistics> {
    const ballots = await this.ballotRepository.findByTournament(tournamentId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');
    const teams = await this.teamRepository.findByTournament(tournamentId);
    const speakers = await this.speakerRepository.findByTournament(tournamentId);
    const rounds = await this.roundRepository.findByTournament(tournamentId);
    const debates = await this.debateRepository.findByTournament(tournamentId);

    const totalDebates = debates.length;
    const totalRounds = rounds.length;

    const allScores = approvedBallots.flatMap((b) => b.speakerScores.map((s) => s.score));
    const averageSpeakerScore =
      allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

    let highestScoringDebate = '';
    let lowestScoringDebate = '';
    let highestAvg = 0;
    let lowestAvg = Infinity;

    for (const ballot of approvedBallots) {
      const scores = ballot.speakerScores.map((s) => s.score);
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avg > highestAvg) {
          highestAvg = avg;
          highestScoringDebate = ballot.debateId;
        }
        if (avg < lowestAvg) {
          lowestAvg = avg;
          lowestScoringDebate = ballot.debateId;
        }
      }
    }

    return {
      tournamentId,
      tournamentName: '',
      totalRounds,
      totalDebates,
      totalTeams: teams.length,
      totalSpeakers: speakers.length,
      totalAdjudicators: 0,
      totalVenues: 0,
      totalRooms: 0,
      averageDebatesPerRound: totalRounds > 0 ? totalDebates / totalRounds : 0,
      averagePanelSize: 0,
      averageSpeakerScore,
      highestScoringDebate,
      lowestScoringDebate,
    };
  }

  private calculateTeamStatistics(
    teamId: string,
    teamName: string,
    institutionId: string,
    ballots: Ballot[],
  ): TeamStatistics {
    let wins = 0;
    let losses = 0;
    let totalPoints = 0;
    let totalSpeakerScore = 0;
    let speakerScoreCount = 0;
    let govDebates = 0;
    let oppDebates = 0;
    let govWins = 0;
    let oppWins = 0;
    let firstPlaceFinishes = 0;
    let secondPlaceFinishes = 0;
    let thirdPlaceFinishes = 0;
    let fourthPlaceFinishes = 0;

    for (const ballot of ballots) {
      const teamRanking = ballot.rankings.find((r) => r.teamId === teamId);
      if (!teamRanking) continue;

      const sortedRankings = [...ballot.rankings].sort((a, b) => b.points - a.points);
      const isWinner = sortedRankings[0]?.teamId === teamId;

      if (isWinner) wins++;
      else losses++;

      totalPoints += teamRanking.points;

      if (teamRanking.position === 'AG' || teamRanking.position === 'BG') {
        govDebates++;
        if (isWinner) govWins++;
      } else {
        oppDebates++;
        if (isWinner) oppWins++;
      }

      const rankIndex = sortedRankings.findIndex((r) => r.teamId === teamId);
      if (rankIndex === 0) firstPlaceFinishes++;
      else if (rankIndex === 1) secondPlaceFinishes++;
      else if (rankIndex === 2) thirdPlaceFinishes++;
      else if (rankIndex === 3) fourthPlaceFinishes++;

      const teamScores = ballot.speakerScores.filter((s) => s.teamId === teamId);
      for (const score of teamScores) {
        totalSpeakerScore += score.score;
        speakerScoreCount++;
      }
    }

    const totalDebates = wins + losses;

    return {
      teamId,
      teamName,
      institutionId,
      totalDebates,
      wins,
      losses,
      winRate: totalDebates > 0 ? wins / totalDebates : 0,
      totalPoints,
      averagePoints: totalDebates > 0 ? totalPoints / totalDebates : 0,
      totalSpeakerScore,
      averageSpeakerScore: speakerScoreCount > 0 ? totalSpeakerScore / speakerScoreCount : 0,
      govDebates,
      oppDebates,
      govWinRate: govDebates > 0 ? govWins / govDebates : 0,
      oppWinRate: oppDebates > 0 ? oppWins / oppDebates : 0,
      firstPlaceFinishes,
      secondPlaceFinishes,
      thirdPlaceFinishes,
      fourthPlaceFinishes,
    };
  }

  private calculateSpeakerStatistics(
    speakerId: string,
    speakerName: string,
    teamId: string,
    teamName: string,
    institutionId: string,
    ballots: Ballot[],
  ): SpeakerStatistics {
    const scores: number[] = [];

    for (const ballot of ballots) {
      const speakerScores = ballot.speakerScores.filter((s) => s.speakerId === speakerId);
      for (const score of speakerScores) {
        scores.push(score.score);
      }
    }

    const totalScore = scores.reduce((a, b) => a + b, 0);
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median =
      sortedScores.length % 2 === 0
        ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
        : sortedScores[Math.floor(sortedScores.length / 2)];

    const mean = scores.length > 0 ? totalScore / scores.length : 0;
    const variance =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
        : 0;

    return {
      speakerId,
      speakerName,
      teamId,
      teamName,
      institutionId,
      totalSpeeches: scores.length,
      totalScore,
      averageScore: mean,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      medianScore: median,
      standardDeviation: Math.sqrt(variance),
      scores,
    };
  }
}
