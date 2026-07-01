import type { ID, Timestamps } from './base';
import type { EntityStatus } from '@/config/constants';

export interface Speaker extends Timestamps {
  id: ID;
  teamId: ID;
  institutionId: ID;
  fullName: string;
  email?: string;
  phone?: string;
  status: EntityStatus;
}

export interface SpeakerCreate {
  teamId: ID;
  institutionId: ID;
  fullName: string;
  email?: string;
  phone?: string;
}

export interface SpeakerUpdate {
  teamId?: ID;
  institutionId?: ID;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: EntityStatus;
}
