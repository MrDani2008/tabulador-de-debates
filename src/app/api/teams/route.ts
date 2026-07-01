import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { TeamRepository } from '@/lib/repositories/team-repository';
import { TeamService } from '@/lib/services/team-service';
import { validateRequest, teamCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new TeamRepository(provider);
    const service = new TeamService(repository);
    const teams = await service.list();
    return NextResponse.json({ data: teams });
  } catch (error) {
    logger.error('Failed to list teams', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(teamCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new TeamRepository(provider);
    const service = new TeamService(repository);
    const team = await service.create(validation.data);
    return NextResponse.json({ data: team }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create team', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
