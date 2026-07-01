import type { Team, TeamCreate, TeamUpdate } from '@/lib/types';
import type { TeamRepository } from '@/lib/repositories/team-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class TeamService {
  constructor(private repository: TeamRepository) {}

  async list(): Promise<Team[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Team> {
    const team = await this.repository.findById(id);
    if (!team) {
      throw new NotFoundError('Team', id);
    }
    return team;
  }

  async create(data: TeamCreate): Promise<Team> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: TeamUpdate): Promise<Team> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async findByTournament(tournamentId: string): Promise<Team[]> {
    return this.repository.findByTournament(tournamentId);
  }

  async findByInstitution(institutionId: string): Promise<Team[]> {
    return this.repository.findByInstitution(institutionId);
  }

  async findByCategory(category: string): Promise<Team[]> {
    return this.repository.findByCategory(category);
  }

  private validateCreate(data: TeamCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.institutionId) {
      errors.institutionId = ['Institution ID is required'];
    }

    if (!data.name || data.name.trim().length === 0) {
      errors.name = ['Team name is required'];
    }

    if (!data.code || data.code.trim().length === 0) {
      errors.code = ['Team code is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid team data', errors);
    }
  }

  private validateUpdate(data: TeamUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.name = ['Team name cannot be empty'];
    }

    if (data.code !== undefined && data.code.trim().length === 0) {
      errors.code = ['Team code cannot be empty'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid team data', errors);
    }
  }
}
