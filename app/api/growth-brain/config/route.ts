import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    let config = await prisma.growthConfig.findFirst();
    if (!config) {
        config = await prisma.growthConfig.create({
            data: { followerCount: 0 },
        });
    }
    return NextResponse.json(config);
}

export async function PATCH(req: NextRequest) {
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
