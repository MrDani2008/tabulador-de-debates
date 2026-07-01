import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { RoundRepository } from '@/lib/repositories/round-repository';
import { RoundService } from '@/lib/services/round-service';
import { validateRequest, roundCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new RoundRepository(provider);
    const service = new RoundService(repository);
    const rounds = await service.list();
    return NextResponse.json({ data: rounds });
  } catch (error) {
    logger.error('Failed to list rounds', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(roundCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new RoundRepository(provider);
    const service = new RoundService(repository);
    const round = await service.create(validation.data);
    return NextResponse.json({ data: round }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create round', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
