import type { sheets_v4 } from 'googleapis';
import { logger } from '@/lib/logger';
import { ExternalServiceError } from '@/lib/errors';

export interface BatchReadResult {
  headers: string[];
  rows: string[][];
}

export async function batchRead(
  client: sheets_v4.Sheets,
  sheetId: string,
  sheetName: string,
): Promise<BatchReadResult> {
  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return { headers: [], rows: [] };
    }

    return {
      headers: values[0],
      rows: values.slice(1),
    };
  } catch (error) {
    logger.error(`Batch read failed for ${sheetName}`, error as Error);
    throw new ExternalServiceError('Google Sheets', `Failed to read ${sheetName}`);
  }
}

export async function batchWrite(
  client: sheets_v4.Sheets,
  sheetId: string,
  sheetName: string,
  headers: string[],
  rows: string[][],
): Promise<void> {
  try {
    const existing = await batchRead(client, sheetId, sheetName);
    const needsHeader = existing.rows.length === 0;

    if (needsHeader) {
      await client.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
      });
    }

    if (rows.length === 0) return;

    await client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: rows },
    });

    logger.info(`Batch write: ${rows.length} rows to ${sheetName}`);
  } catch (error) {
    logger.error(`Batch write failed for ${sheetName}`, error as Error);
    throw new ExternalServiceError('Google Sheets', `Failed to write to ${sheetName}`);
  }
}

export async function batchUpdate(
  client: sheets_v4.Sheets,
  sheetId: string,
  sheetName: string,
  rowIndex: number,
  headers: string[],
  row: string[],
): Promise<void> {
  try {
    const rowNumber = rowIndex + 2;
    await client.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    logger.info(`Batch update: row ${rowNumber} in ${sheetName}`);
  } catch (error) {
    logger.error(`Batch update failed for ${sheetName}`, error as Error);
    throw new ExternalServiceError('Google Sheets', `Failed to update ${sheetName}`);
  }
}

export async function batchDelete(
  client: sheets_v4.Sheets,
  sheetId: string,
  sheetName: string,
  rowIndex: number,
): Promise<void> {
  try {
    const rowNumber = rowIndex + 2;
    await client.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${rowNumber}:Z${rowNumber}`,
    });

    logger.info(`Batch delete: row ${rowNumber} from ${sheetName}`);
  } catch (error) {
    logger.error(`Batch delete failed for ${sheetName}`, error as Error);
    throw new ExternalServiceError('Google Sheets', `Failed to delete from ${sheetName}`);
  }
}
