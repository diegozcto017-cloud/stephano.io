import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSecurityHeaders } from '@/server/middlewares/security';

export async function GET(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    const headers = getSecurityHeaders();
    try {
        const propuesta = await prisma.propuesta.findUnique({
            where: { token: params.token },
            select: {
                id: true,
                token: true,
                clientName: true,
                clientCompany: true,
                service: true,
                total: true,
                proposalText: true,
                sentAt: true,
                viewedAt: true,
            },
        });

        if (!propuesta) {
            return NextResponse.json({ success: false, error: 'Propuesta no encontrada.' }, { status: 404, headers });
        }

        // Mark as viewed on first access
        if (!propuesta.viewedAt) {
            await prisma.propuesta.update({
                where: { token: params.token },
                data: { viewedAt: new Date() },
            });
        }

        return NextResponse.json({ success: true, data: propuesta }, { status: 200, headers });
    } catch (error) {
        console.error('[API /p/:token]', error);
        return NextResponse.json({ success: false, error: 'Error al cargar propuesta.' }, { status: 500, headers });
    }
}
