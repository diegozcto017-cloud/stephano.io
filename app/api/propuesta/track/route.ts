import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSecurityHeaders } from '@/server/middlewares/security';

// POST — save a new propuesta
export async function POST(req: NextRequest) {
    const headers = getSecurityHeaders();
    try {
        const body = await req.json();
        const { clientName, clientCompany, clientPhone, clientEmail, service, total, proposalText, sentVia, leadId } = body;

        if (!clientName || !proposalText || !service || total == null) {
            return NextResponse.json({ success: false, error: 'Faltan campos requeridos.' }, { status: 400, headers });
        }

        const propuesta = await prisma.propuesta.create({
            data: {
                clientName,
                clientCompany: clientCompany || null,
                clientPhone: clientPhone || null,
                clientEmail: clientEmail || null,
                service,
                total: Number(total),
                proposalText,
                sentVia: sentVia || 'copia',
                leadId: leadId ? Number(leadId) : null,
                estado: 'enviada',
            },
        });

        // Also update the Lead pipeline stage if we have a leadId
        if (leadId) {
            await prisma.lead.update({
                where: { id: Number(leadId) },
                data: { pipelineStage: 'propuesta_enviada' },
            }).catch(() => {});
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stephano.io';
        const publicUrl = `${baseUrl}/p/${propuesta.token}`;
        return NextResponse.json({ success: true, data: propuesta, publicUrl }, { status: 201, headers });
    } catch (error) {
        console.error('[API /propuesta/track POST]', error);
        return NextResponse.json({ success: false, error: 'Error al guardar propuesta.' }, { status: 500, headers });
    }
}

// GET — list all propuestas
export async function GET(req: NextRequest) {
    const headers = getSecurityHeaders();
    try {
        const authHeader = req.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
        }

        const propuestas = await prisma.propuesta.findMany({
            orderBy: { sentAt: 'desc' },
        });

        return NextResponse.json({ success: true, data: propuestas }, { status: 200, headers });
    } catch (error) {
        console.error('[API /propuesta/track GET]', error);
        return NextResponse.json({ success: false, error: 'Error al obtener propuestas.' }, { status: 500, headers });
    }
}

// PATCH — update estado or notas
export async function PATCH(req: NextRequest) {
    const headers = getSecurityHeaders();
    try {
        const authHeader = req.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
        }

        const { id, estado, notas, followupAt } = await req.json();
        if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400, headers });

        const updated = await prisma.propuesta.update({
            where: { id: Number(id) },
            data: {
                ...(estado && { estado }),
                ...(notas !== undefined && { notas }),
                ...(followupAt && { followupAt: new Date(followupAt) }),
            },
        });

        // Sync pipeline stage to Lead
        if (estado && updated.leadId) {
            const stageMap: Record<string, string> = {
                enviada: 'propuesta_enviada',
                en_negociacion: 'negociacion_activa',
                cerrada_ganada: 'contrato_cerrado',
                cerrada_perdida: 'contrato_perdido',
                sin_respuesta: 'propuesta_enviada',
            };
            if (stageMap[estado]) {
                await prisma.lead.update({
                    where: { id: updated.leadId },
                    data: { pipelineStage: stageMap[estado] },
                }).catch(() => {});
            }
        }

        return NextResponse.json({ success: true, data: updated }, { status: 200, headers });
    } catch (error) {
        console.error('[API /propuesta/track PATCH]', error);
        return NextResponse.json({ success: false, error: 'Error al actualizar propuesta.' }, { status: 500, headers });
    }
}
