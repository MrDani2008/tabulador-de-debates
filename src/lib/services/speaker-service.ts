import type { Speaker, SpeakerCreate, SpeakerUpdate } from '@/lib/types';
import type { SpeakerRepository } from '@/lib/repositories/speaker-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class SpeakerService {
  constructor(private repository: SpeakerRepository) {}

  async list(): Promise<Speaker[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Speaker> {
    const speaker = await this.repository.findById(id);
    if (!speaker) {
      throw new NotFoundError('Speaker', id);
    }
    return speaker;
  }

  async create(data: SpeakerCreate): Promise<Speaker> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: SpeakerUpdate): Promise<Speaker> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async findByTeam(teamId: string): Promise<Speaker[]> {
    return this.repository.findByTeam(teamId);
  }

  async findByInstitution(institutionId: string): Promise<Speaker[]> {
    return this.repository.findByInstitution(institutionId);
  }

  private validateCreate(data: SpeakerCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.teamId) {
      errors.teamId = ['Team ID is required'];
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
      throw new ValidationError('Invalid speaker data', errors);
    }
  }

  private validateUpdate(data: SpeakerUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.fullName !== undefined && data.fullName.trim().length === 0) {
      errors.fullName = ['Full name cannot be empty'];
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.email = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid speaker data', errors);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
