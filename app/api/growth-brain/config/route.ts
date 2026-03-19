import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    let config = await prisma.growthConfig.findFirst();
    if (!config) {
        config = await prisma.growthConfig.create({
            data: { followerCount: 0 },
        });
    }
    return NextResponse.json(config);
}

export async function PATCH(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    let config = await prisma.growthConfig.findFirst();

    if (!config) {
        config = await prisma.growthConfig.create({ data: { followerCount: 0 } });
    }

    const updated = await prisma.growthConfig.update({
        where: { id: config.id },
        data: {
            followerCount: body.followerCount ?? config.followerCount,
            mode: body.mode ?? config.mode,
            niche: body.niche ?? config.niche,
            targetAudience: body.targetAudience ?? config.targetAudience,
        },
    });

    return NextResponse.json(updated);
}
