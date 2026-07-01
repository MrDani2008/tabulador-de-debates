import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { VenueRepository } from '@/lib/repositories/venue-repository';
import { VenueService } from '@/lib/services/venue-service';
import { validateRequest, venueCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new VenueRepository(provider);
    const service = new VenueService(repository);
    const venues = await service.list();
    return NextResponse.json({ data: venues });
  } catch (error) {
    logger.error('Failed to list venues', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(venueCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new VenueRepository(provider);
    const service = new VenueService(repository);
    const venue = await service.create(validation.data);
    return NextResponse.json({ data: venue }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create venue', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
