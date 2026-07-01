import { google, type sheets_v4 } from 'googleapis';
import type { DataProvider } from './types';
import { batchRead, batchWrite, batchUpdate, batchDelete } from './google-sheets/batch';
import { withRetry } from './google-sheets/retry';
import { logger } from '@/lib/logger';
import { ExternalServiceError } from '@/lib/errors';

interface GoogleSheetsConfig {
  privateKey: string;
  clientEmail: string;
  sheetId: string;
}

export class GoogleSheetsProvider implements DataProvider {
  private client: sheets_v4.Sheets | null = null;
  private config: GoogleSheetsConfig;
  private connected = false;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      const privateKey = this.config.privateKey.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: this.config.clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.client = google.sheets({ version: 'v4', auth });
      this.connected = true;

      logger.info('Google Sheets provider connected');
    } catch (error) {
      this.connected = false;
      logger.error('Failed to connect to Google Sheets', error as Error);
      throw new ExternalServiceError('Google Sheets', 'Connection failed');
    }
  }

  async disconnect(): Promise<void> {
    this.client = null;
    this.connected = false;
    logger.info('Google Sheets provider disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const client = this.ensureConnected();
      await client.spreadsheets.get({
        spreadsheetId: this.config.sheetId,
        fields: 'spreadsheetId',
      });
      return true;
    } catch {
      return false;
    }
  }

  private ensureConnected(): sheets_v4.Sheets {
    if (!this.client || !this.connected) {
      throw new ExternalServiceError('Google Sheets', 'Not connected');
    }
    return this.client;
  }

  async getAll<T>(sheetName: string): Promise<T[]> {
    const client = this.ensureConnected();

    return withRetry(async () => {
      const { headers, rows } = await batchRead(client, this.config.sheetId, sheetName);
      if (headers.length === 0) return [];
      return rows.map((row) => this.rowToObject<T>(headers, row));
    });
  }

  async getById<T>(sheetName: string, id: string): Promise<T | null> {
    const all = await this.getAll<T & { id: string }>(sheetName);
    return all.find((item) => item.id === id) ?? null;
  }

  async create<T>(sheetName: string, data: T): Promise<T> {
    const client = this.ensureConnected();
    const dataObj = data as Record<string, unknown>;

    return withRetry(async () => {
      const existing = await this.getAll(sheetName);
      const headers =
        existing.length > 0 ? Object.keys(existing[0] as object) : Object.keys(dataObj);
      const row = headers.map((header) => String(dataObj[header] ?? ''));

      await batchWrite(client, this.config.sheetId, sheetName, headers, [row]);
      logger.info(`Created record in ${sheetName}`, { id: dataObj.id });
      return data;
    });
  }

  async update<T>(sheetName: string, id: string, data: Partial<T>): Promise<T> {
    const client = this.ensureConnected();
    const dataObj = data as Record<string, unknown>;

    return withRetry(async () => {
      const all = await this.getAll<T & { id: string }>(sheetName);
      const rowIndex = all.findIndex((item) => item.id === id);

      if (rowIndex === -1) {
        throw new Error(`Record with id '${id}' not found in ${sheetName}`);
      }

      const existing = all[rowIndex] as Record<string, unknown>;
      const merged: Record<string, unknown> = { ...existing, ...dataObj, id };
      const headers = Object.keys(existing);
      const row = headers.map((header) => String(merged[header] ?? ''));

      await batchUpdate(client, this.config.sheetId, sheetName, rowIndex, headers, row);
      logger.info(`Updated record in ${sheetName}`, { id });
      return merged as T;
    });
  }

  async delete(sheetName: string, id: string): Promise<void> {
    const client = this.ensureConnected();

    return withRetry(async () => {
      const all = await this.getAll<{ id: string }>(sheetName);
      const rowIndex = all.findIndex((item) => item.id === id);

      if (rowIndex === -1) {
        throw new Error(`Record with id '${id}' not found in ${sheetName}`);
      }

      await batchDelete(client, this.config.sheetId, sheetName, rowIndex);
      logger.info(`Deleted record from ${sheetName}`, { id });
    });
  }

  async query<T>(sheetName: string, filters: Record<string, unknown>): Promise<T[]> {
    const all = await this.getAll<T & Record<string, unknown>>(sheetName);
    return all.filter((item) =>
      Object.entries(filters).every(([key, value]) => item[key] === value),
    );
  }

  private rowToObject<T>(headers: string[], row: string[]): T {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? '';
    });
    return obj as T;
  }
}
