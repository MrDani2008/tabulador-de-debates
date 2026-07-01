export const DEBATE_POSITIONS = {
  AG: 'AG',
  AO: 'AO',
  BG: 'BG',
  BO: 'BO',
} as const;

export type DebatePosition = (typeof DEBATE_POSITIONS)[keyof typeof DEBATE_POSITIONS];

export const GOVERNMENT_POSITIONS: readonly DebatePosition[] = [DEBATE_POSITIONS.AG, DEBATE_POSITIONS.BG];

export const OPPOSITION_POSITIONS: readonly DebatePosition[] = [DEBATE_POSITIONS.AO, DEBATE_POSITIONS.BO];

export const OPENING_POSITIONS: readonly DebatePosition[] = [DEBATE_POSITIONS.AG, DEBATE_POSITIONS.AO];

export const CLOSING_POSITIONS: readonly DebatePosition[] = [DEBATE_POSITIONS.BG, DEBATE_POSITIONS.BO];

export const TOURNAMENT_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type TournamentStatus = (typeof TOURNAMENT_STATUS)[keyof typeof TOURNAMENT_STATUS];

export const ROUND_STATUS = {
  DRAFT: 'DRAFT',
  GENERATED: 'GENERATED',
  PUBLISHED: 'PUBLISHED',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type RoundStatus = (typeof ROUND_STATUS)[keyof typeof ROUND_STATUS];

export const ROUND_TYPE = {
  PRELIMINARY: 'PRELIMINARY',
  ELIMINATION: 'ELIMINATION',
  SEMI_FINAL: 'SEMI_FINAL',
  QUARTER_FINAL: 'QUARTER_FINAL',
  FINAL: 'FINAL',
} as const;

export type RoundType = (typeof ROUND_TYPE)[keyof typeof ROUND_TYPE];

export const ENTITY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EntityStatus = (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];

export const TEAM_CATEGORY = {
  OPEN: 'OPEN',
  ESL: 'ESL',
  EFL: 'EFL',
  NOVICE: 'NOVICE',
} as const;

export type TeamCategory = (typeof TEAM_CATEGORY)[keyof typeof TEAM_CATEGORY];

export const ADJUDICATOR_CATEGORY = {
  CHAIR: 'CHAIR',
  PANELIST: 'PANELIST',
  WING: 'WING',
  TRAINING: 'TRAINING',
} as const;

export type AdjudicatorCategory = (typeof ADJUDICATOR_CATEGORY)[keyof typeof ADJUDICATOR_CATEGORY];

export const ADJUDICATOR_EXPERIENCE = {
  NOVICE: 'NOVICE',
  INTERMEDIATE: 'INTERMEDIATE',
  EXPERIENCED: 'EXPERIENCED',
  SENIOR: 'SENIOR',
} as const;

export type AdjudicatorExperience =
  (typeof ADJUDICATOR_EXPERIENCE)[keyof typeof ADJUDICATOR_EXPERIENCE];

export const BALLOT_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  LOCKED: 'LOCKED',
} as const;

export type BallotStatus = (typeof BALLOT_STATUS)[keyof typeof BALLOT_STATUS];

export const DEFAULT_CONFIG = {
  MAX_PRELIMINARY_ROUNDS: 5,
  JUDGES_PER_DEBATE: 3,
  TEAM_SIZE: 2,
  POINTS_WIN: 3,
  POINTS_LOSS: 0,
  SPEAKER_MAX_SCORE: 80,
  SPEAKER_MIN_SCORE: 0,
} as const;
