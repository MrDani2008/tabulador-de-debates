import type { ID, PaginationParams, PaginatedResult, FilterParams } from '@/lib/types/base';

export interface ReadRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  findMany(filters: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
}

export interface WriteRepository<T, TCreate, TUpdate> {
  create(data: TCreate): Promise<T>;
  update(id: ID, data: TUpdate): Promise<T>;
  delete(id: ID): Promise<void>;
}

export type Repository<T, TCreate = Partial<T>, TUpdate = Partial<T>> = ReadRepository<T> &
  WriteRepository<T, TCreate, TUpdate>;

export interface RepositoryConfig {
  sheetName: string;
  entityName: string;
}
