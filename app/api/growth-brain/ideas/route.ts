import { NextRequest, NextResponse } from 'next/server';
import { generateContentIdeas } from '@/server/services/growth-brain.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { niche, audience, count = 8 } = body;

    if (!niche) {
        return NextResponse.json({ error: 'niche es requerido' }, { status: 400 });
    }

    try {
        const ideas = await generateContentIdeas(
            niche,
            audience || 'empresas y emprendedores en Costa Rica',
            count
        );
        return NextResponse.json({ ideas });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
    }
}
