import type { Venue, VenueCreate, VenueUpdate } from '@/lib/types';
import type { VenueRepository } from '@/lib/repositories/venue-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class VenueService {
  constructor(private repository: VenueRepository) {}

  async list(): Promise<Venue[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Venue> {
    const venue = await this.repository.findById(id);
    if (!venue) {
      throw new NotFoundError('Venue', id);
    }
    return venue;
  }

  async create(data: VenueCreate): Promise<Venue> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: VenueUpdate): Promise<Venue> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async findByTournament(tournamentId: string): Promise<Venue[]> {
    return this.repository.findByTournament(tournamentId);
  }

  private validateCreate(data: VenueCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.name || data.name.trim().length === 0) {
      errors.name = ['Venue name is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid venue data', errors);
    }
  }

  private validateUpdate(data: VenueUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.name = ['Venue name cannot be empty'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid venue data', errors);
    }
  }
}
