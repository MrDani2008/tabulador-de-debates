import type { Adjudicator, AdjudicatorCreate, AdjudicatorUpdate, Conflict, ConflictCreate } from '@/lib/types';
import type { AdjudicatorRepository } from '@/lib/repositories/adjudicator-repository';
import type { ConflictRepository } from '@/lib/repositories/conflict-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class AdjudicatorService {
  constructor(
    private repository: AdjudicatorRepository,
    private conflictRepository: ConflictRepository,
  ) {}

  async list(): Promise<Adjudicator[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Adjudicator> {
    const adjudicator = await this.repository.findById(id);
    if (!adjudicator) {
      throw new NotFoundError('Adjudicator', id);
    }
    return adjudicator;
  }

  async create(data: AdjudicatorCreate): Promise<Adjudicator> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: AdjudicatorUpdate): Promise<Adjudicator> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async findByTournament(tournamentId: string): Promise<Adjudicator[]> {
    return this.repository.findByTournament(tournamentId);
  }

  async findByCategory(category: string): Promise<Adjudicator[]> {
    return this.repository.findByCategory(category);
  }

  async addConflict(data: ConflictCreate): Promise<Conflict> {
    if (!data.adjudicatorId) {
      throw new ValidationError('Adjudicator ID is required');
    }

    if (!data.targetId) {
      throw new ValidationError('Target ID is required');
    }

    const existing = await this.conflictRepository.hasConflict(data.adjudicatorId, data.targetId);
    if (existing) {
      throw new ValidationError('Conflict already exists');
    }

    return this.conflictRepository.create(data);
  }

  async removeConflict(id: string): Promise<void> {
    await this.conflictRepository.delete(id);
  }

  async getConflicts(adjudicatorId: string): Promise<Conflict[]> {
    return this.conflictRepository.findByAdjudicator(adjudicatorId);
  }

  async hasConflict(adjudicatorId: string, targetId: string): Promise<boolean> {
    return this.conflictRepository.hasConflict(adjudicatorId, targetId);
  }

  private validateCreate(data: AdjudicatorCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.institutionId) {
      errors.institutionId = ['Institution ID is required'];
    }

    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.fullName = ['Full name is required'];
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.email = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid adjudicator data', errors);
    }
  }

  private validateUpdate(data: AdjudicatorUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.fullName !== undefined && data.fullName.trim().length === 0) {
      errors.fullName = ['Full name cannot be empty'];
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.email = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid adjudicator data', errors);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
