import type { ID, Timestamps } from './base';
import type { TeamCategory, EntityStatus } from '@/config/constants';

export interface Team extends Timestamps {
  id: ID;
  tournamentId: ID;
  institutionId: ID;
  name: string;
  code: string;
  category: TeamCategory;
  status: EntityStatus;
  registrationDate: string;
}

export interface TeamCreate {
  tournamentId: ID;
  institutionId: ID;
  name: string;
  code: string;
  category?: TeamCategory;
}

export interface TeamUpdate {
  institutionId?: ID;
  name?: string;
  code?: string;
  category?: TeamCategory;
  status?: EntityStatus;
}
