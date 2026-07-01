export interface SheetMapper<T> {
  toRow(entity: T): string[];
  fromRow(headers: string[], row: string[]): T;
  headers(): string[];
}

export function createMapper<T extends Record<string, unknown>>(
  fieldDefs: FieldDef[],
): SheetMapper<T> {
  return {
    headers() {
      return fieldDefs.map((f) => f.sheetColumn);
    },

    toRow(entity: T): string[] {
      return fieldDefs.map((f) => {
        const value = entity[f.entityField];
        return serializeValue(value, f.type);
      });
    },

    fromRow(headers: string[], row: string[]): T {
      const obj = {} as Record<string, unknown>;
      headers.forEach((header, index) => {
        const fieldDef = fieldDefs.find((f) => f.sheetColumn === header);
        if (fieldDef) {
          obj[fieldDef.entityField] = deserializeValue(row[index] ?? '', fieldDef.type);
        }
      });
      return obj as T;
    },
  };
}

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'json';

export interface FieldDef {
  entityField: string;
  sheetColumn: string;
  type: FieldType;
}

function serializeValue(value: unknown, type: FieldType): string {
  if (value === null || value === undefined) return '';
  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      return String(value);
    case 'boolean':
      return value ? 'TRUE' : 'FALSE';
    case 'date':
      return value instanceof Date ? value.toISOString() : String(value);
    case 'json':
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

function deserializeValue(raw: string, type: FieldType): unknown {
  if (raw === '') return undefined;
  switch (type) {
    case 'string':
      return raw;
    case 'number':
      return Number(raw);
    case 'boolean':
      return raw === 'TRUE';
    case 'date':
      return raw;
    case 'json':
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    default:
      return raw;
  }
}
