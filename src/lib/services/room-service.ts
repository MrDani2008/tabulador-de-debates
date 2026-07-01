import type { Room, RoomCreate, RoomUpdate } from '@/lib/types';
import type { RoomRepository } from '@/lib/repositories/room-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';

export class RoomService {
  constructor(private repository: RoomRepository) {}

  async list(): Promise<Room[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Room> {
    const room = await this.repository.findById(id);
    if (!room) {
      throw new NotFoundError('Room', id);
    }
    return room;
  }

  async create(data: RoomCreate): Promise<Room> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: RoomUpdate): Promise<Room> {
    await this.getById(id);
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async findByVenue(venueId: string): Promise<Room[]> {
    return this.repository.findByVenue(venueId);
  }

  async findByTournament(tournamentId: string): Promise<Room[]> {
    return this.repository.findByTournament(tournamentId);
  }

  private validateCreate(data: RoomCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.venueId) {
      errors.venueId = ['Venue ID is required'];
    }

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.name || data.name.trim().length === 0) {
      errors.name = ['Room name is required'];
    }

    if (data.capacity !== undefined && data.capacity < 1) {
      errors.capacity = ['Capacity must be at least 1'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid room data', errors);
    }
  }

  private validateUpdate(data: RoomUpdate): void {
    const errors: Record<string, string[]> = {};

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.name = ['Room name cannot be empty'];
    }

    if (data.capacity !== undefined && data.capacity < 1) {
      errors.capacity = ['Capacity must be at least 1'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid room data', errors);
    }
  }
}
