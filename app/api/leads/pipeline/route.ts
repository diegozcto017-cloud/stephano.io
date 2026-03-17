import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_STAGES = [
    'nuevo_lead',
    'lead_analizado',
    'lead_calificado',
    'propuesta_enviada',
    'negociacion_activa',
    'contrato_cerrado',
    'contrato_perdido',
];

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { leadId, pipelineStage } = body;

        if (!leadId || typeof leadId !== 'number') {
            return NextResponse.json({ error: 'leadId requerido (número)' }, { status: 400 });
        }

        if (!pipelineStage || !VALID_STAGES.includes(pipelineStage)) {
            return NextResponse.json(
                { error: `pipelineStage inválido. Opciones: ${VALID_STAGES.join(', ')}` },
                { status: 400 }
            );
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
        }

        const updated = await prisma.lead.update({
            where: { id: leadId },
            data: { pipelineStage },
        });

        return NextResponse.json({
            leadId: updated.id,
            pipelineStage: updated.pipelineStage,
            nombre: updated.nombre,
        });
    } catch (err) {
        console.error('[leads/pipeline]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Error interno' },
            { status: 500 }
        );
    }
}
