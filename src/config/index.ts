import { z } from 'zod';

const configSchema = z.object({
  app: z.object({
    name: z.string().default('BP Tournament Manager'),
  }),
  google: z.object({
    privateKey: z.string().min(1, 'GOOGLE_SHEETS_PRIVATE_KEY is required'),
    clientEmail: z.string().email('GOOGLE_SHEETS_CLIENT_EMAIL must be a valid email'),
    sheetId: z.string().min(1, 'GOOGLE_SHEETS_SHEET_ID is required'),
  }),
  isServer: z.boolean().default(true),
  isClient: z.boolean().default(false),
});

type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const raw = {
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME,
    },
    google: {
      privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      sheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
    },
    isServer: typeof window === 'undefined',
    isClient: typeof window !== 'undefined',
  };

  const result = configSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const messages = Object.entries(errors)
      .map(([key, value]) => `${key}: ${value?.join(', ')}`)
      .join('\n');
    throw new Error(`Configuration error:\n${messages}`);
  }

  return result.data;
}

let _config: Config | null = null;

export function getConfig(): Config {
  if (!_config) {
    _config = loadConfig();
  }
  return _config;
}

export type { Config };
