import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { RoomRepository } from '@/lib/repositories/room-repository';
import { RoomService } from '@/lib/services/room-service';
import { validateRequest, roomCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new RoomRepository(provider);
    const service = new RoomService(repository);
    const rooms = await service.list();
    return NextResponse.json({ data: rooms });
  } catch (error) {
    logger.error('Failed to list rooms', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(roomCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new RoomRepository(provider);
    const service = new RoomService(repository);
    const room = await service.create(validation.data);
    return NextResponse.json({ data: room }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create room', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
