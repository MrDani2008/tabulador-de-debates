import type { DataProvider } from '@/lib/providers';
import type { User, UserCreate, UserUpdate } from '@/lib/types';
import { BaseRepository } from './base-repository';

const SHEET_NAME = 'Users';

export class UserRepository extends BaseRepository<User, UserCreate, UserUpdate> {
  constructor(provider: DataProvider) {
    super(provider, {
      sheetName: SHEET_NAME,
      entityName: 'User',
    });
  }

  protected buildCreateEntity(data: UserCreate, now: string): User {
    return {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      institutionId: data.institutionId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
  }

  protected matchesSearch(entity: User, query: string): boolean {
    return (
      entity.name.toLowerCase().includes(query) || entity.email.toLowerCase().includes(query)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.provider.query<User>(this.config.sheetName, { email });
    return users[0] ?? null;
  }

  async findByRole(role: string): Promise<User[]> {
    return this.provider.query<User>(this.config.sheetName, { role });
  }
}
