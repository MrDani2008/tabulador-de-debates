import type { ID, Timestamps } from './base';
import type { RoundStatus, RoundType, DebatePosition, BallotStatus } from '@/config/constants';

export interface Round extends Timestamps {
  id: ID;
  tournamentId: ID;
  number: number;
  type: RoundType;
  status: RoundStatus;
}

export interface RoundCreate {
  tournamentId: ID;
  number: number;
  type?: RoundType;
}

export interface RoundUpdate {
  type?: RoundType;
  status?: RoundStatus;
}

export interface Debate extends Timestamps {
  id: ID;
  roundId: ID;
  tournamentId: ID;
  roomId?: ID;
  positions: DebatePositions;
}

export interface DebatePositions {
  AG: ID;
  AO: ID;
  BG: ID;
  BO: ID;
}

export interface DebateCreate {
  roundId: ID;
  tournamentId: ID;
  roomId?: ID;
  positions: DebatePositions;
}

export interface Ballot extends Timestamps {
  id: ID;
  debateId: ID;
  roundId: ID;
  tournamentId: ID;
  rankings: TeamRanking[];
  speakerScores: SpeakerScore[];
  comments?: string;
  status: BallotStatus;
  submittedAt?: string;
}

export interface TeamRanking {
  teamId: ID;
  position: DebatePosition;
  points: number;
}

export interface SpeakerScore {
  speakerId: ID;
  teamId: ID;
  score: number;
}

export interface BallotCreate {
  debateId: ID;
  roundId: ID;
  tournamentId: ID;
  rankings: TeamRanking[];
  speakerScores: SpeakerScore[];
  comments?: string;
}

export interface BallotUpdate {
  rankings?: TeamRanking[];
  speakerScores?: SpeakerScore[];
  comments?: string;
  status?: BallotStatus;
  submittedAt?: string;
}
