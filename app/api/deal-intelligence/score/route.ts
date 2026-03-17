import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { scoreLead } from '@/server/services/deal-intelligence.service';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { leadId } = body;

        if (!leadId || typeof leadId !== 'number') {
            return NextResponse.json({ error: 'leadId requerido (número)' }, { status: 400 });
        }

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
            return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
        }

        const result = await scoreLead({
            nombre: lead.nombre,
            empresa: lead.empresa ?? undefined,
            tipo_proyecto: lead.tipo_proyecto,
            presupuesto_rango: lead.presupuesto_rango ?? undefined,
            urgencia: lead.urgencia ?? undefined,
            mensaje: lead.mensaje ?? undefined,
        });

        // Update lead in DB with score, category, and factors
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                leadScore: result.score,
                leadCategory: result.category,
                scoreFactors: JSON.stringify(result.factors),
            },
        });

        return NextResponse.json({
            leadId,
            ...result,
        });
    } catch (err) {
        console.error('[deal-intelligence/score]', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Error interno' },
            { status: 500 }
        );
    }
}
