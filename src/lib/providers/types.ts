export interface DataProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  getAll<T>(sheetName: string): Promise<T[]>;
  getById<T>(sheetName: string, id: string): Promise<T | null>;
  create<T>(sheetName: string, data: T): Promise<T>;
  update<T>(sheetName: string, id: string, data: Partial<T>): Promise<T>;
  delete(sheetName: string, id: string): Promise<void>;
  query<T>(sheetName: string, filters: Record<string, unknown>): Promise<T[]>;
}
