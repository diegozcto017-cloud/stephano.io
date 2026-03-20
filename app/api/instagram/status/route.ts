import { NextResponse } from 'next/server';
import { InstagramService } from '@/server/services/instagram.service';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(InstagramService.getSetupStatus());
}
