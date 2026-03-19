import { NextRequest, NextResponse } from 'next/server';
import { generate30DayCalendar } from '@/server/services/growth-brain.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { niche, audience } = body;

    try {
        const calendar = await generate30DayCalendar(
            niche || 'desarrollo web y software',
            audience || 'empresas y emprendedores en Costa Rica'
        );
        return NextResponse.json({ calendar });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
    }
}
