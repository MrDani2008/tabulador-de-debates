import { GoogleSheetsProvider } from './google-sheets';
import type { DataProvider } from './types';
import { getConfig } from '@/config';

let _provider: DataProvider | null = null;

export function getProvider(): DataProvider {
  if (!_provider) {
    const config = getConfig();
    _provider = new GoogleSheetsProvider({
      privateKey: config.google.privateKey,
      clientEmail: config.google.clientEmail,
      sheetId: config.google.sheetId,
    });
  }
  return _provider;
}

export async function connectProvider(): Promise<DataProvider> {
  const provider = getProvider();
  if (!provider.isConnected()) {
    await provider.connect();
  }
  return provider;
}

export async function disconnectProvider(): Promise<void> {
  if (_provider) {
    await _provider.disconnect();
    _provider = null;
  }
}

export type { DataProvider };
export { GoogleSheetsProvider };
export { createMapper } from './google-sheets/mapper';
export type { SheetMapper, FieldDef, FieldType } from './google-sheets/mapper';
export { batchRead, batchWrite, batchUpdate, batchDelete } from './google-sheets/batch';
export { withRetry, RetryError } from './google-sheets/retry';
export type { RetryConfig } from './google-sheets/retry';
