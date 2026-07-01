import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { SpeakerRepository } from '@/lib/repositories/speaker-repository';
import { SpeakerService } from '@/lib/services/speaker-service';
import { validateRequest, speakerCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new SpeakerRepository(provider);
    const service = new SpeakerService(repository);
    const speakers = await service.list();
    return NextResponse.json({ data: speakers });
  } catch (error) {
    logger.error('Failed to list speakers', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(speakerCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new SpeakerRepository(provider);
    const service = new SpeakerService(repository);
    const speaker = await service.create(validation.data);
    return NextResponse.json({ data: speaker }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create speaker', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
