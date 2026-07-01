import type { ID, Timestamps } from './base';
import type { EntityStatus } from '@/config/constants';

export interface Institution extends Timestamps {
  id: ID;
  name: string;
  shortName: string;
  country: string;
  region?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: EntityStatus;
}

export interface InstitutionCreate {
  name: string;
  shortName: string;
  country: string;
  region?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface InstitutionUpdate {
  name?: string;
  shortName?: string;
  country?: string;
  region?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: EntityStatus;
}
