import type { Institution, InstitutionCreate, InstitutionUpdate } from '@/lib/types';
import type { InstitutionRepository } from '@/lib/repositories/institution-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class InstitutionService {
  constructor(private repository: InstitutionRepository) {}

  async list(): Promise<Institution[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Institution> {
    const institution = await this.repository.findById(id);
    if (!institution) {
      throw new NotFoundError('Institution', id);
    }
    return institution;
  }

  async create(data: InstitutionCreate): Promise<Institution> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: InstitutionUpdate): Promise<Institution> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async search(query: string): Promise<Institution[]> {
    const all = await this.repository.findAll();
    const lower = query.toLowerCase();
    return all.filter(
      (i) =>
        i.name.toLowerCase().includes(lower) ||
        i.shortName.toLowerCase().includes(lower) ||
        i.country.toLowerCase().includes(lower),
    );
  }

  private validateCreate(data: InstitutionCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = ['Institution name is required'];
    }

    if (!data.shortName || data.shortName.trim().length === 0) {
      errors.shortName = ['Short name is required'];
    }

    if (!data.country || data.country.trim().length === 0) {
      errors.country = ['Country is required'];
    }

    if (data.contactEmail && !this.isValidEmail(data.contactEmail)) {
      errors.contactEmail = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid institution data', errors);
    }
  }

  private validateUpdate(data: InstitutionUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.name = ['Institution name cannot be empty'];
    }

    if (data.shortName !== undefined && data.shortName.trim().length === 0) {
      errors.shortName = ['Short name cannot be empty'];
    }

    if (data.contactEmail && !this.isValidEmail(data.contactEmail)) {
      errors.contactEmail = ['Invalid email format'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid institution data', errors);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
