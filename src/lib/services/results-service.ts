import type { Ballot, TeamRanking, SpeakerScore } from '@/lib/types';
import type { BallotRepository } from '@/lib/repositories/ballot-repository';
import type { DebateRepository } from '@/lib/repositories/debate-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export interface ProcessedResult {
  ballotId: string;
  debateId: string;
  roundId: string;
  tournamentId: string;
  rankings: TeamRanking[];
  speakerScores: SpeakerScore[];
  processedAt: string;
}

export interface TeamResult {
  teamId: string;
  wins: number;
  losses: number;
  totalPoints: number;
  speakerScoreTotal: number;
  speakerScoreCount: number;
  averageSpeakerScore: number;
  govAppearances: number;
  oppAppearances: number;
  openAppearances: number;
  closeAppearances: number;
}

export interface SpeakerResult {
  speakerId: string;
  teamId: string;
  totalScore: number;
  speechCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export class ResultsService {
  constructor(
    private ballotRepository: BallotRepository,
    private debateRepository: DebateRepository,
  ) {}

  async processBallot(ballotId: string): Promise<ProcessedResult> {
    const ballot = await this.ballotRepository.findById(ballotId);
    if (!ballot) {
      throw new NotFoundError('Ballot', ballotId);
    }

    if (ballot.status !== 'APPROVED') {
      throw new ValidationError('Only approved ballots can be processed');
    }

    const result: ProcessedResult = {
      ballotId: ballot.id,
      debateId: ballot.debateId,
      roundId: ballot.roundId,
      tournamentId: ballot.tournamentId,
      rankings: ballot.rankings,
      speakerScores: ballot.speakerScores,
      processedAt: new Date().toISOString(),
    };

    return result;
  }

  async processRound(roundId: string): Promise<ProcessedResult[]> {
    const ballots = await this.ballotRepository.findByRound(roundId);
    const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');

    if (approvedBallots.length === 0) {
      throw new ValidationError('No approved ballots found for this round');
    }

    const results: ProcessedResult[] = [];
    for (const ballot of approvedBallots) {
      const result = await this.processBallot(ballot.id);
      results.push(result);
    }

    return results;
  }

  async calculateTeamResults(tournamentId: string, roundIds: string[]): Promise<Map<string, TeamResult>> {
    const teamResults = new Map<string, TeamResult>();

    for (const roundId of roundIds) {
      const ballots = await this.ballotRepository.findByRound(roundId);
      const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');

      for (const ballot of approvedBallots) {
        this.updateTeamResults(teamResults, ballot);
      }
    }

    return teamResults;
  }

  async calculateSpeakerResults(tournamentId: string, roundIds: string[]): Promise<Map<string, SpeakerResult>> {
    const speakerResults = new Map<string, SpeakerResult>();

    for (const roundId of roundIds) {
      const ballots = await this.ballotRepository.findByRound(roundId);
      const approvedBallots = ballots.filter((b) => b.status === 'APPROVED');

      for (const ballot of approvedBallots) {
        this.updateSpeakerResults(speakerResults, ballot);
      }
    }

    return speakerResults;
  }

  private updateTeamResults(teamResults: Map<string, TeamResult>, ballot: Ballot): void {
    const { rankings } = ballot;
    if (!rankings || rankings.length === 0) return;

    const sortedRankings = [...rankings].sort((a, b) => b.points - a.points);
    const winnerTeamId = sortedRankings[0].teamId;

    for (const ranking of rankings) {
      let result = teamResults.get(ranking.teamId);
      if (!result) {
        result = {
          teamId: ranking.teamId,
          wins: 0,
          losses: 0,
          totalPoints: 0,
          speakerScoreTotal: 0,
          speakerScoreCount: 0,
          averageSpeakerScore: 0,
          govAppearances: 0,
          oppAppearances: 0,
          openAppearances: 0,
          closeAppearances: 0,
        };
        teamResults.set(ranking.teamId, result);
      }

      if (ranking.teamId === winnerTeamId) {
        result.wins++;
      } else {
        result.losses++;
      }

      result.totalPoints += ranking.points;

      if (ranking.position === 'AG' || ranking.position === 'BG') {
        result.govAppearances++;
      } else {
        result.oppAppearances++;
      }

      if (ranking.position === 'AG' || ranking.position === 'AO') {
        result.openAppearances++;
      } else {
        result.closeAppearances++;
      }
    }

    const teamScores = ballot.speakerScores.filter((s) =>
      rankings.some((r) => r.teamId === s.teamId),
    );

    for (const score of teamScores) {
      const result = teamResults.get(score.teamId);
      if (result) {
        result.speakerScoreTotal += score.score;
        result.speakerScoreCount++;
        result.averageSpeakerScore = result.speakerScoreTotal / result.speakerScoreCount;
      }
    }
  }

  private updateSpeakerResults(speakerResults: Map<string, SpeakerResult>, ballot: Ballot): void {
    const { speakerScores } = ballot;
    if (!speakerScores || speakerScores.length === 0) return;

    for (const score of speakerScores) {
      let result = speakerResults.get(score.speakerId);
      if (!result) {
        result = {
          speakerId: score.speakerId,
          teamId: score.teamId,
          totalScore: 0,
          speechCount: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 100,
        };
        speakerResults.set(score.speakerId, result);
      }

      result.totalScore += score.score;
      result.speechCount++;
      result.averageScore = result.totalScore / result.speechCount;
      result.highestScore = Math.max(result.highestScore, score.score);
      result.lowestScore = Math.min(result.lowestScore, score.score);
    }
  }
}
