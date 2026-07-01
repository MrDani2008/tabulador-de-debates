import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { AdjudicatorRepository } from '@/lib/repositories/adjudicator-repository';
import { ConflictRepository } from '@/lib/repositories/conflict-repository';
import { AdjudicatorService } from '@/lib/services/adjudicator-service';
import { validateRequest, adjudicatorCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new AdjudicatorRepository(provider);
    const conflictRepository = new ConflictRepository(provider);
    const service = new AdjudicatorService(repository, conflictRepository);
    const adjudicators = await service.list();
    return NextResponse.json({ data: adjudicators });
  } catch (error) {
    logger.error('Failed to list adjudicators', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(adjudicatorCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new AdjudicatorRepository(provider);
    const conflictRepository = new ConflictRepository(provider);
    const service = new AdjudicatorService(repository, conflictRepository);
    const adjudicator = await service.create(validation.data);
    return NextResponse.json({ data: adjudicator }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create adjudicator', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
