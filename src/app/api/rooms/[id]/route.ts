import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { RoomRepository } from '@/lib/repositories/room-repository';
import { RoomService } from '@/lib/services/room-service';
import { validateRequest, roomUpdateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError, NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = await connectProvider();
    const repository = new RoomRepository(provider);
    const service = new RoomService(repository);
    const room = await service.getById(id);
    return NextResponse.json({ data: room });
  } catch (error) {
    logger.error('Failed to get room', error as Error);
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
    const validation = validateRequest(roomUpdateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new RoomRepository(provider);
    const service = new RoomService(repository);
    const room = await service.update(id, validation.data);
    return NextResponse.json({ data: room });
  } catch (error) {
    logger.error('Failed to update room', error as Error);
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
    const repository = new RoomRepository(provider);
    const service = new RoomService(repository);
    await service.delete(id);
    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    logger.error('Failed to delete room', error as Error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
