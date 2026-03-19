import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const callSid = formData.get('CallSid') as string;
        const callStatus = formData.get('CallStatus') as string;
        const to = formData.get('To') as string;
        const duration = formData.get('CallDuration') as string;

        console.log(`[calls/status] ${callSid} → ${callStatus} (${duration}s) → ${to}`);

        // Log to DB if lead exists with this phone
        if (callStatus === 'completed' && to) {
            const normalized = to.replace(/\D/g, '');
            const lead = await prisma.lead.findFirst({
                where: { telefono: { contains: normalized.slice(-8) } },
            });

            if (lead) {
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        estado: 'contactado',
                        mensaje: `${lead.mensaje || ''}\n[Llamada IA ${new Date().toLocaleDateString('es-CR')} — ${duration}s — ${callStatus}]`.trim(),
                    },
                });
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('[calls/status]', error);
        return new NextResponse('Error', { status: 500 });
    }
}
