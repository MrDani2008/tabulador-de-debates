import { NextResponse } from 'next/server';
import { connectProvider } from '@/lib/providers';
import { InstitutionRepository } from '@/lib/repositories/institution-repository';
import { InstitutionService } from '@/lib/services/institution-service';
import { validateRequest, institutionCreateSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const provider = await connectProvider();
    const repository = new InstitutionRepository(provider);
    const service = new InstitutionService(repository);
    const institutions = await service.list();
    return NextResponse.json({ data: institutions });
  } catch (error) {
    logger.error('Failed to list institutions', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(institutionCreateSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, fields: validation.fields }, { status: 400 });
    }

    const provider = await connectProvider();
    const repository = new InstitutionRepository(provider);
    const service = new InstitutionService(repository);
    const institution = await service.create(validation.data);
    return NextResponse.json({ data: institution }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create institution', error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
