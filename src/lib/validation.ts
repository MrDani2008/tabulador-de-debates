import { z } from 'zod';

export const idSchema = z.string().min(1);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const tournamentCreateSchema = z.object({
  name: z.string().min(1).max(200),
  logo: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  settings: z
    .object({
      preliminaryRounds: z.number().int().min(1).max(20).optional(),
      eliminationRounds: z.number().int().min(0).max(10).optional(),
      judgesPerDebate: z.number().int().min(1).max(7).optional(),
      teamSize: z.number().int().min(1).max(4).optional(),
    })
    .optional(),
});

export const tournamentUpdateSchema = tournamentCreateSchema.partial();

export const institutionCreateSchema = z.object({
  name: z.string().min(1).max(200),
  shortName: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  region: z.string().max(100).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional(),
});

export const institutionUpdateSchema = institutionCreateSchema.partial();

export const teamCreateSchema = z.object({
  tournamentId: idSchema,
  institutionId: idSchema,
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(20),
  category: z.enum(['OPEN', 'ESL', 'EFL', 'NOVICE']).optional(),
});

export const teamUpdateSchema = teamCreateSchema.omit({ tournamentId: true }).partial();

export const speakerCreateSchema = z.object({
  teamId: idSchema,
  institutionId: idSchema,
  fullName: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
});

export const speakerUpdateSchema = speakerCreateSchema.partial();

export const adjudicatorCreateSchema = z.object({
  tournamentId: idSchema,
  institutionId: idSchema,
  fullName: z.string().min(1).max(200),
  category: z.enum(['CHAIR', 'PANELIST', 'WING', 'TRAINING']).optional(),
  experience: z.enum(['NOVICE', 'INTERMEDIATE', 'EXPERIENCED', 'SENIOR']).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

export const adjudicatorUpdateSchema = adjudicatorCreateSchema.omit({ tournamentId: true }).partial();

export const venueCreateSchema = z.object({
  tournamentId: idSchema,
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  description: z.string().max(500).optional(),
});

export const venueUpdateSchema = venueCreateSchema.omit({ tournamentId: true }).partial();

export const roomCreateSchema = z.object({
  venueId: idSchema,
  tournamentId: idSchema,
  name: z.string().min(1).max(200),
  capacity: z.number().int().min(1).max(100).default(8),
  accessibilityNotes: z.string().max(500).optional(),
});

export const roomUpdateSchema = roomCreateSchema.omit({ tournamentId: true }).partial();

export const roundCreateSchema = z.object({
  tournamentId: idSchema,
  number: z.number().int().min(1),
  type: z.enum(['PRELIMINARY', 'ELIMINATION', 'SEMI_FINAL', 'QUARTER_FINAL', 'FINAL']).optional(),
});

export const roundUpdateSchema = z.object({
  type: z.enum(['PRELIMINARY', 'ELIMINATION', 'SEMI_FINAL', 'QUARTER_FINAL', 'FINAL']).optional(),
  status: z.enum(['DRAFT', 'GENERATED', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'ARCHIVED']).optional(),
});

export const teamRankingSchema = z.object({
  teamId: idSchema,
  position: z.enum(['AG', 'AO', 'BG', 'BO']),
  points: z.number().int().min(0),
});

export const speakerScoreSchema = z.object({
  speakerId: idSchema,
  teamId: idSchema,
  score: z.number().min(0).max(80),
});

export const ballotCreateSchema = z.object({
  debateId: idSchema,
  roundId: idSchema,
  tournamentId: idSchema,
  rankings: z.array(teamRankingSchema).length(4),
  speakerScores: z.array(speakerScoreSchema).min(1),
  comments: z.string().max(2000).optional(),
});

export const ballotUpdateSchema = z.object({
  rankings: z.array(teamRankingSchema).length(4).optional(),
  speakerScores: z.array(speakerScoreSchema).min(1).optional(),
  comments: z.string().max(2000).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'LOCKED']).optional(),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string; fields?: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
  return {
    success: false,
    error: 'Validation failed',
    fields: fieldErrors,
  };
}
