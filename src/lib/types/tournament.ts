import type { ID, Timestamps } from './base';
import type { TournamentStatus } from '@/config/constants';

export interface TournamentSettings {
  preliminaryRounds: number;
  eliminationRounds: number;
  judgesPerDebate: number;
  teamSize: number;
  speakerConfiguration: SpeakerConfig[];
  rankingRules: RankingRules;
  tieBreakRules: TieBreakRule[];
  ballotConfiguration: BallotConfig;
  publicVisibility: boolean;
}

export interface SpeakerConfig {
  name: string;
  maxScore: number;
  minScore: number;
}

export interface RankingRules {
  primary: 'wins' | 'points' | 'speakerScore';
  tieBreaks: string[];
}

export interface TieBreakRule {
  name: string;
  order: number;
}

export interface BallotConfig {
  requireAllSpeakers: boolean;
  allowPartialSubmission: boolean;
  requireComments: boolean;
}

export interface Tournament extends Timestamps {
  id: ID;
  name: string;
  logo?: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  settings: TournamentSettings;
}

export interface TournamentCreate {
  name: string;
  logo?: string;
  startDate: string;
  endDate: string;
  settings?: Partial<TournamentSettings>;
}

export interface TournamentUpdate {
  name?: string;
  logo?: string;
  startDate?: string;
  endDate?: string;
  status?: TournamentStatus;
  settings?: Partial<TournamentSettings>;
}
