import { NextRequest, NextResponse } from 'next/server';
import { getPipelineStats } from '@/server/services/revenue-predictor.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    try {
        const stats = await getPipelineStats();
        return NextResponse.json(stats);
    } catch (err) {
        console.error('[revenue-predictor]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Error interno' },
            { status: 500 }
        );
    }
}
