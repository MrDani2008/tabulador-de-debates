import type { DataProvider } from '@/lib/providers';
import type { Conflict, ConflictCreate } from '@/lib/types';
import { v4 } from '@/lib/utils';

const SHEET_NAME = 'Conflicts';

export class ConflictRepository {
  constructor(private provider: DataProvider) {}

  async findAll(): Promise<Conflict[]> {
    return this.provider.getAll<Conflict>(SHEET_NAME);
  }

  async findById(id: string): Promise<Conflict | null> {
    return this.provider.getById<Conflict>(SHEET_NAME, id);
  }

  async create(data: ConflictCreate): Promise<Conflict> {
    const conflict: Conflict = {
      id: v4(),
      ...data,
    };
    return this.provider.create<Conflict>(SHEET_NAME, conflict);
  }

  async delete(id: string): Promise<void> {
    await this.provider.delete(SHEET_NAME, id);
  }

  async findByAdjudicator(adjudicatorId: string): Promise<Conflict[]> {
    return this.provider.query<Conflict>(SHEET_NAME, { adjudicatorId });
  }

  async findByAdjudicatorAndType(adjudicatorId: string, conflictType: string): Promise<Conflict[]> {
    const all = await this.findByAdjudicator(adjudicatorId);
    return all.filter((c) => c.conflictType === conflictType);
  }

  async hasConflict(adjudicatorId: string, targetId: string): Promise<boolean> {
    const conflicts = await this.findByAdjudicator(adjudicatorId);
    return conflicts.some((c) => c.targetId === targetId);
  }
}
