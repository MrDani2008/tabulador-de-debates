import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { BallotRepository } from '@/lib/repositories/ballot-repository';
import { BallotService } from '@/lib/services/ballot-service';
import { validateRequest, ballotCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new BallotRepository(provider);
    const service = new BallotService(repository);
    const ballots = await service.list();
    return NextResponse.json({ data: ballots });
  } catch (error) {
    logger.error('Failed to list ballots', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(ballotCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new BallotRepository(provider);
    const service = new BallotService(repository);
    const ballot = await service.create(validation.data);
    return NextResponse.json({ data: ballot }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create ballot', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
