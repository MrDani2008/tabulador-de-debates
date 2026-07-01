import type { DataProvider } from '@/lib/providers';
import type { ID, Timestamps, PaginationParams, PaginatedResult, FilterParams } from '@/lib/types/base';
import type { Repository, RepositoryConfig } from './types';
import { NotFoundError } from '@/lib/errors';

export abstract class BaseRepository<T extends Timestamps, TCreate, TUpdate>
  implements Repository<T, TCreate, TUpdate>
{
  protected readonly provider: DataProvider;
  protected readonly config: RepositoryConfig;

  constructor(provider: DataProvider, config: RepositoryConfig) {
    this.provider = provider;
    this.config = config;
  }

  async findAll(): Promise<T[]> {
    return this.provider.getAll<T>(this.config.sheetName);
  }

  async findById(id: ID): Promise<T | null> {
    return this.provider.getById<T>(this.config.sheetName, id);
  }

  async findRequired(id: ID): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundError(this.config.entityName, id);
    }
    return entity;
  }

  async findMany(
    filters: FilterParams,
    pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<T>> {
    let all = await this.findAll();

    if (filters.search) {
      const lower = filters.search.toLowerCase();
      all = all.filter((item) => this.matchesSearch(item, lower));
    }

    if (filters.status) {
      all = all.filter((item) => (item as Record<string, unknown>).status === filters.status);
    }

    const total = all.length;
    const start = (pagination.page - 1) * pagination.limit;
    const data = all.slice(start, start + pagination.limit);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async create(data: TCreate): Promise<T> {
    const now = new Date().toISOString();
    const entity = this.buildCreateEntity(data, now);
    return this.provider.create<T>(this.config.sheetName, entity);
  }

  async update(id: ID, data: TUpdate): Promise<T> {
    await this.findRequired(id);
    const now = new Date().toISOString();
    const updateData = { ...data, updatedAt: now } as Partial<T>;
    return this.provider.update<T>(this.config.sheetName, id, updateData);
  }

  async delete(id: ID): Promise<void> {
    await this.findRequired(id);
    await this.provider.delete(this.config.sheetName, id);
  }

  protected abstract buildCreateEntity(data: TCreate, now: string): T;

  protected abstract matchesSearch(entity: T, query: string): boolean;
}
