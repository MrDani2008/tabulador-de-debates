import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { TournamentRepository } from '@/lib/repositories/tournament-repository';
import { TournamentService } from '@/lib/services/tournament-service';
import { validateRequest } from '@/lib/validation';
import { tournamentCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new TournamentRepository(provider);
    const service = new TournamentService(repository);
    const tournaments = await service.list();
    return NextResponse.json({ data: tournaments });
  } catch (error) {
    logger.error('Failed to list tournaments', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(tournamentCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new TournamentRepository(provider);
    const service = new TournamentService(repository);
    const tournament = await service.create(validation.data);
    return NextResponse.json({ data: tournament }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create tournament', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
