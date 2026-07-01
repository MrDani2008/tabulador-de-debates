import type { Tournament, TournamentCreate, TournamentUpdate } from '@/lib/types';
import type { TournamentRepository } from '@/lib/repositories/tournament-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { TOURNAMENT_STATUS, type TournamentStatus } from '@/config/constants';

const VALID_TRANSITIONS: Record<TournamentStatus, TournamentStatus[]> = {
  DRAFT: [TOURNAMENT_STATUS.ACTIVE],
  ACTIVE: [TOURNAMENT_STATUS.COMPLETED],
  COMPLETED: [TOURNAMENT_STATUS.ARCHIVED],
  ARCHIVED: [],
};

export class TournamentService {
  constructor(private repository: TournamentRepository) {}

  async list(): Promise<Tournament[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Tournament> {
    const tournament = await this.repository.findById(id);
    if (!tournament) {
      throw new NotFoundError('Tournament', id);
    }
    return tournament;
  }

  async create(data: TournamentCreate): Promise<Tournament> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: TournamentUpdate): Promise<Tournament> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const tournament = await this.getById(id);
    if (tournament.status === TOURNAMENT_STATUS.ACTIVE) {
      throw new ValidationError('Cannot delete an active tournament. Close it first.');
    }
    return this.repository.delete(id);
  }

  async changeStatus(id: string, newStatus: TournamentStatus): Promise<Tournament> {
    const tournament = await this.getById(id);
    const allowed = VALID_TRANSITIONS[tournament.status];

    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from '${tournament.status}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    return this.repository.update(id, { status: newStatus });
  }

  async activate(id: string): Promise<Tournament> {
    return this.changeStatus(id, TOURNAMENT_STATUS.ACTIVE);
  }

  async complete(id: string): Promise<Tournament> {
    return this.changeStatus(id, TOURNAMENT_STATUS.COMPLETED);
  }

  async archive(id: string): Promise<Tournament> {
    return this.changeStatus(id, TOURNAMENT_STATUS.ARCHIVED);
  }

  private validateCreate(data: TournamentCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = ['Tournament name is required'];
    }

    if (!data.startDate) {
      errors.startDate = ['Start date is required'];
    }

    if (!data.endDate) {
      errors.endDate = ['End date is required'];
    }

    if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
      errors.endDate = ['End date must be after start date'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid tournament data', errors);
    }
  }

  private validateUpdate(data: TournamentUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.name = ['Tournament name cannot be empty'];
    }

    if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
      errors.endDate = ['End date must be after start date'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid tournament data', errors);
    }
  }
}
