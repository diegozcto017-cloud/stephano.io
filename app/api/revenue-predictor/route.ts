import { NextResponse } from 'next/server';
import { getPipelineStats } from '@/server/services/revenue-predictor.service';

export const dynamic = 'force-dynamic';

export async function GET() {
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
