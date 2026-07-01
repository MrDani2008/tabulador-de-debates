import type { Round, RoundCreate, RoundUpdate } from '@/lib/types';
import type { RoundRepository } from '@/lib/repositories/round-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { ROUND_STATUS, type RoundStatus } from '@/config/constants';

const VALID_TRANSITIONS: Record<RoundStatus, RoundStatus[]> = {
  DRAFT: [ROUND_STATUS.GENERATED],
  GENERATED: [ROUND_STATUS.PUBLISHED],
  PUBLISHED: [ROUND_STATUS.ACTIVE],
  ACTIVE: [ROUND_STATUS.CLOSED],
  CLOSED: [ROUND_STATUS.ARCHIVED],
  ARCHIVED: [],
};

export class RoundService {
  constructor(private repository: RoundRepository) {}

  async list(): Promise<Round[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Round> {
    const round = await this.repository.findById(id);
    if (!round) {
      throw new NotFoundError('Round', id);
    }
    return round;
  }

  async create(data: RoundCreate): Promise<Round> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: RoundUpdate): Promise<Round> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const round = await this.getById(id);
    if (round.status !== 'DRAFT') {
      throw new ValidationError('Only draft rounds can be deleted');
    }
    return this.repository.delete(id);
  }

  async findByTournament(tournamentId: string): Promise<Round[]> {
    return this.repository.findByTournament(tournamentId);
  }

  async findActive(tournamentId: string): Promise<Round | null> {
    return this.repository.findActive(tournamentId);
  }

  async changeStatus(id: string, newStatus: RoundStatus): Promise<Round> {
    const round = await this.getById(id);
    const allowed = VALID_TRANSITIONS[round.status];

    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from '${round.status}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    return this.repository.update(id, { status: newStatus });
  }

  async generate(id: string): Promise<Round> {
    return this.changeStatus(id, ROUND_STATUS.GENERATED);
  }

  async publish(id: string): Promise<Round> {
    return this.changeStatus(id, ROUND_STATUS.PUBLISHED);
  }

  async activate(id: string): Promise<Round> {
    return this.changeStatus(id, ROUND_STATUS.ACTIVE);
  }

  async close(id: string): Promise<Round> {
    return this.changeStatus(id, ROUND_STATUS.CLOSED);
  }

  async archive(id: string): Promise<Round> {
    return this.changeStatus(id, ROUND_STATUS.ARCHIVED);
  }

  private validateCreate(data: RoundCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.number || data.number < 1) {
      errors.number = ['Round number must be at least 1'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid round data', errors);
    }
  }

  private validateUpdate(data: RoundUpdate): void {
    if (data.type !== undefined || data.status !== undefined) {
      return;
    }
    throw new ValidationError('No fields to update');
  }
}
