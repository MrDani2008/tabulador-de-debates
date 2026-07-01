import type { ID, Timestamps } from './base';
import type { EntityStatus } from '@/config/constants';

export interface Venue extends Timestamps {
  id: ID;
  tournamentId: ID;
  name: string;
  address?: string;
  description?: string;
  status: EntityStatus;
}

export interface VenueCreate {
  tournamentId: ID;
  name: string;
  address?: string;
  description?: string;
}

export interface VenueUpdate {
  name?: string;
  address?: string;
  description?: string;
  status?: EntityStatus;
}

export interface Room extends Timestamps {
  id: ID;
  venueId: ID;
  tournamentId: ID;
  name: string;
  capacity: number;
  accessibilityNotes?: string;
  status: EntityStatus;
}

export interface RoomCreate {
  venueId: ID;
  tournamentId: ID;
  name: string;
  capacity?: number;
  accessibilityNotes?: string;
}

export interface RoomUpdate {
  venueId?: ID;
  name?: string;
  capacity?: number;
  accessibilityNotes?: string;
  status?: EntityStatus;
}
