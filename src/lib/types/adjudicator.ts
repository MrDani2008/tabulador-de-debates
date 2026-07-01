import type { ID, Timestamps } from './base';
import type { AdjudicatorCategory, AdjudicatorExperience, EntityStatus } from '@/config/constants';

export interface Adjudicator extends Timestamps {
  id: ID;
  tournamentId: ID;
  institutionId: ID;
  fullName: string;
  category: AdjudicatorCategory;
  experience: AdjudicatorExperience;
  email?: string;
  phone?: string;
  notes?: string;
  status: EntityStatus;
}

export interface AdjudicatorCreate {
  tournamentId: ID;
  institutionId: ID;
  fullName: string;
  category?: AdjudicatorCategory;
  experience?: AdjudicatorExperience;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface AdjudicatorUpdate {
  institutionId?: ID;
  fullName?: string;
  category?: AdjudicatorCategory;
  experience?: AdjudicatorExperience;
  email?: string;
  phone?: string;
  notes?: string;
  status?: EntityStatus;
}

export interface Conflict {
  id: ID;
  adjudicatorId: ID;
  conflictType: 'institution' | 'team' | 'personal';
  targetId: ID;
  notes?: string;
}

export interface ConflictCreate {
  adjudicatorId: ID;
  conflictType: 'institution' | 'team' | 'personal';
  targetId: ID;
  notes?: string;
}
