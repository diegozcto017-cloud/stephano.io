import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/server/services/email.service';
import prisma from '@/lib/prisma';
import { getSecurityHeaders } from '@/server/middlewares/security';

export async function POST(req: NextRequest) {
    const headers = getSecurityHeaders();
    try {
        const {
            toEmail, toName, toCompany, clientPhone, service, total,
            proposalText, timeline, leadId,
        } = await req.json();

        if (!toEmail || !toName || !proposalText || !service || total == null) {
            return NextResponse.json({ success: false, error: 'Faltan campos requeridos.' }, { status: 400, headers });
        }

        // Send the email
        await EmailService.sendProposalToProspect({
            toEmail, toName, toCompany, service, total: Number(total), proposalText, timeline,
        });

        // Save to tracker
        const propuesta = await prisma.propuesta.create({
            data: {
                clientName: toName,
                clientCompany: toCompany || null,
                clientPhone: clientPhone || null,
                clientEmail: toEmail,
                service,
                total: Number(total),
                proposalText,
                sentVia: 'email',
                leadId: leadId ? Number(leadId) : null,
                estado: 'enviada',
            },
        });

        // Sync lead pipeline stage
        if (leadId) {
            await prisma.lead.update({
                where: { id: Number(leadId) },
                data: { pipelineStage: 'propuesta_enviada' },
            }).catch(() => {});
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://stephano.io';
        const publicUrl = `${baseUrl}/p/${propuesta.token}`;
        return NextResponse.json({ success: true, propuestaId: propuesta.id, publicUrl }, { status: 200, headers });
    } catch (error) {
        console.error('[API /propuesta/send-email]', error);
        const msg = error instanceof Error ? error.message : 'Error al enviar';
        return NextResponse.json({ success: false, error: msg }, { status: 500, headers });
    }
}
