import type { Ballot, BallotCreate, BallotUpdate } from '@/lib/types';
import type { BallotRepository } from '@/lib/repositories/ballot-repository';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { BALLOT_STATUS, type BallotStatus } from '@/config/constants';

const VALID_TRANSITIONS: Record<BallotStatus, BallotStatus[]> = {
  DRAFT: [BALLOT_STATUS.SUBMITTED],
  SUBMITTED: [BALLOT_STATUS.APPROVED, BALLOT_STATUS.DRAFT],
  APPROVED: [BALLOT_STATUS.LOCKED],
  LOCKED: [],
};

export class BallotService {
  constructor(private repository: BallotRepository) {}

  async list(): Promise<Ballot[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Ballot> {
    const ballot = await this.repository.findById(id);
    if (!ballot) {
      throw new NotFoundError('Ballot', id);
    }
    return ballot;
  }

  async create(data: BallotCreate): Promise<Ballot> {
    this.validateCreate(data);
    return this.repository.create(data);
  }

  async update(id: string, data: BallotUpdate): Promise<Ballot> {
    const ballot = await this.getById(id);
    if (ballot.status === 'LOCKED') {
      throw new ValidationError('Cannot modify a locked ballot');
    }
    this.validateUpdate(data);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const ballot = await this.getById(id);
    if (ballot.status === 'APPROVED' || ballot.status === 'LOCKED') {
      throw new ValidationError('Cannot delete an approved or locked ballot');
    }
    return this.repository.delete(id);
  }

  async submit(id: string): Promise<Ballot> {
    return this.changeStatus(id, BALLOT_STATUS.SUBMITTED);
  }

  async approve(id: string): Promise<Ballot> {
    const ballot = await this.getById(id);
    this.validateBallotComplete(ballot);
    return this.changeStatus(id, BALLOT_STATUS.APPROVED);
  }

  async lock(id: string): Promise<Ballot> {
    return this.changeStatus(id, BALLOT_STATUS.LOCKED);
  }

  async reopen(id: string): Promise<Ballot> {
    return this.changeStatus(id, BALLOT_STATUS.DRAFT);
  }

  async findByDebate(debateId: string): Promise<Ballot | null> {
    return this.repository.findByDebate(debateId);
  }

  async findByRound(roundId: string): Promise<Ballot[]> {
    return this.repository.findByRound(roundId);
  }

  private async changeStatus(id: string, newStatus: BallotStatus): Promise<Ballot> {
    const ballot = await this.getById(id);
    const allowed = VALID_TRANSITIONS[ballot.status];

    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from '${ballot.status}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }

    const updateData: BallotUpdate = { status: newStatus };
    if (newStatus === BALLOT_STATUS.SUBMITTED) {
      updateData.submittedAt = new Date().toISOString();
    }

    return this.repository.update(id, updateData);
  }

  private validateBallotComplete(ballot: Ballot): void {
    const errors: Record<string, string[]> = {};

    if (!ballot.rankings || ballot.rankings.length !== 4) {
      errors.rankings = ['Ballot must have exactly 4 team rankings'];
    }

    if (!ballot.speakerScores || ballot.speakerScores.length === 0) {
      errors.speakerScores = ['Ballot must have at least one speaker score'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Ballot is incomplete', errors);
    }
  }

  private validateCreate(data: BallotCreate): void {
    const errors: Record<string, string[]> = {};

    if (!data.debateId) {
      errors.debateId = ['Debate ID is required'];
    }

    if (!data.roundId) {
      errors.roundId = ['Round ID is required'];
    }

    if (!data.tournamentId) {
      errors.tournamentId = ['Tournament ID is required'];
    }

    if (!data.rankings || data.rankings.length === 0) {
      errors.rankings = ['At least one ranking is required'];
    }

    if (!data.speakerScores || data.speakerScores.length === 0) {
      errors.speakerScores = ['At least one speaker score is required'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid ballot data', errors);
    }
  }

  private validateUpdate(data: BallotUpdate): void {
    if (data.rankings !== undefined && data.rankings.length !== 4) {
      throw new ValidationError('Ballot must have exactly 4 team rankings');
    }
  }
}
