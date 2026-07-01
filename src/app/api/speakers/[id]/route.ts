import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { SpeakerRepository } from '@/lib/repositories/speaker-repository';
import { SpeakerService } from '@/lib/services/speaker-service';
import { validateRequest, speakerUpdateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError, NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = await connectProvider();
    const repository = new SpeakerRepository(provider);
    const service = new SpeakerService(repository);
    const speaker = await service.getById(id);
    return NextResponse.json({ data: speaker });
  } catch (error) {
    logger.error('Failed to get speaker', error as Error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateRequest(speakerUpdateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new SpeakerRepository(provider);
    const service = new SpeakerService(repository);
    const speaker = await service.update(id, validation.data);
    return NextResponse.json({ data: speaker });
  } catch (error) {
    logger.error('Failed to update speaker', error as Error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = await connectProvider();
    const repository = new SpeakerRepository(provider);
    const service = new SpeakerService(repository);
    await service.delete(id);
    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    logger.error('Failed to delete speaker', error as Error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
