import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const posts = await prisma.contentPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { metrics: true },
    });
    return NextResponse.json(posts);
}

export async function PATCH(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const updated = await prisma.contentPost.update({
        where: { id },
        data,
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    await prisma.contentPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
