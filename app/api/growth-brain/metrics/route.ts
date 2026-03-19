import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { analyzePerformance, MetricsInput } from '@/server/services/growth-brain.service';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Save metrics + run analysis
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { postId, metrics }: { postId: number; metrics: MetricsInput } = body;

    if (!postId || !metrics) {
        return NextResponse.json({ error: 'postId y metrics son requeridos' }, { status: 400 });
    }

    try {
        const analysis = await analyzePerformance(metrics);

        await prisma.contentMetrics.upsert({
            where: { postId },
            create: {
                postId,
                views: metrics.views,
                retention: metrics.retention,
                saves: metrics.saves,
                shares: metrics.shares,
                followersGained: metrics.followersGained,
                comments: metrics.comments,
                likes: metrics.likes,
                diagnosis: JSON.stringify(analysis),
            },
            update: {
                views: metrics.views,
                retention: metrics.retention,
                saves: metrics.saves,
                shares: metrics.shares,
                followersGained: metrics.followersGained,
                comments: metrics.comments,
                likes: metrics.likes,
                diagnosis: JSON.stringify(analysis),
                recordedAt: new Date(),
            },
        });

        return NextResponse.json({ analysis });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
    }
}
