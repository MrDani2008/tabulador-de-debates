import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { VenueRepository } from '@/lib/repositories/venue-repository';
import { VenueService } from '@/lib/services/venue-service';
import { validateRequest, venueUpdateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError, NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = await connectProvider();
    const repository = new VenueRepository(provider);
    const service = new VenueService(repository);
    const venue = await service.getById(id);
    return NextResponse.json({ data: venue });
  } catch (error) {
    logger.error('Failed to get venue', error as Error);
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
    const validation = validateRequest(venueUpdateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new VenueRepository(provider);
    const service = new VenueService(repository);
    const venue = await service.update(id, validation.data);
    return NextResponse.json({ data: venue });
  } catch (error) {
    logger.error('Failed to update venue', error as Error);
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
    const repository = new VenueRepository(provider);
    const service = new VenueService(repository);
    await service.delete(id);
    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    logger.error('Failed to delete venue', error as Error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
