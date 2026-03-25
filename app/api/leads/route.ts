import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/server/validators/lead.validator';
import { LeadService } from '@/server/services/lead.service';
import { rateLimit, getSecurityHeaders, sanitizeObject } from '@/server/middlewares/security';

export async function POST(request: NextRequest) {
    const headers = getSecurityHeaders();

    try {
        // Rate limiting
        if (!rateLimit(request)) {
            return NextResponse.json(
                { success: false, error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
                { status: 429, headers }
            );
        }

        // Parse body
        const body = await request.json();

        // Sanitize
        const sanitizedBody = sanitizeObject(body);

        // Validate
        const result = leadSchema.safeParse(sanitizedBody);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => issue.message).join(', ');
            return NextResponse.json(
                { success: false, error: errors },
                { status: 400, headers }
            );
        }

        // Create lead
        const lead = await LeadService.create(result.data);

        // Send emails asynchronously (don't block the response)
        const { EmailService } = await import('@/server/services/email.service');
        Promise.all([
            EmailService.sendLeadNotification(lead),
            EmailService.sendClientConfirmation(lead),
            // Trigger n8n email outreach sequence if webhook is configured
            process.env.N8N_WEBHOOK_URL
                ? fetch(process.env.N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: lead.nombre,
                        email: lead.email,
                        business: lead.empresa ?? lead.nombre,
                        city: 'Costa Rica',
                        service: lead.tipo_proyecto ?? 'Landing Page',
                    }),
                }).catch(err => console.error('[API /leads] n8n webhook error:', err))
                : Promise.resolve(),
            // Trigger n8n auto-pipeline workflow
            process.env.N8N_WEBHOOK_URL
                ? fetch(`${process.env.N8N_WEBHOOK_URL.replace('lead-email-outreach', 'new-lead-pipeline')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId: lead.id,
                        name: lead.nombre,
                        email: lead.email,
                        phone: lead.telefono || '',
                        service: lead.tipo_proyecto,
                    }),
                }).catch(err => console.error('[API /leads] pipeline webhook error:', err))
                : Promise.resolve(),
        ]).catch(err => console.error('[API /leads] Email dispatch error:', err));

        return NextResponse.json(
            { success: true, data: { id: lead.id } },
            { status: 201, headers }
        );
    } catch (error) {
        console.error('[API /leads] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor.' },
            { status: 500, headers }
        );
    }
}
export async function GET(request: NextRequest) {
    const headers = getSecurityHeaders();

    try {
        const authHeader = request.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
        }

        const seedRequested = request.nextUrl.searchParams.get('seed') === 'true';
        if (seedRequested) {
            await LeadService.seedSamples();
            return NextResponse.json({ success: true, message: 'Sample leads created.' }, { status: 200, headers });
        }

        const statsRequested = request.nextUrl.searchParams.get('stats') === 'true';
        const chartRequested = request.nextUrl.searchParams.get('chart') === 'true';

        if (statsRequested) {
            const stats = await LeadService.getStats();
            return NextResponse.json({ success: true, data: stats }, { status: 200, headers });
        }

        if (chartRequested) {
            const PRICE_MAP: Record<string, number> = {
                'Landing Page': 300, 'landing_page': 300, 'landing_p': 300,
                'E-commerce': 1500, 'ecommerce': 1500,
                'CRM / Web App': 5000, 'Web App': 5000, 'CRM': 1000, 'sistema_personalizado': 5000,
                'Corporativa': 800, 'Portfolio': 400,
                'Automatización': 2000, 'automatizacion': 2000,
                'Rediseño': 1000, 'rediseno': 1000,
                'App Móvil': 8000,
                'ai_int': 5000, 'consulting': 1000,
            };
            const allLeads = await LeadService.getAll();
            const now = new Date();
            const monthly = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = d.toLocaleString('es', { month: 'short' });
                const monthLeads = allLeads.filter(l => {
                    const ld = new Date(l.fecha_creacion);
                    return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
                });
                const pipeline = monthLeads.reduce((sum, l) => sum + (PRICE_MAP[l.tipo_proyecto] || 500), 0);
                monthly.push({ label, count: monthLeads.length, pipeline });
            }
            const byType = Object.entries(
                allLeads.reduce((acc, l) => { acc[l.tipo_proyecto] = (acc[l.tipo_proyecto] || 0) + 1; return acc; }, {} as Record<string, number>)
            ).map(([tipo, count]) => ({ tipo, count, value: (PRICE_MAP[tipo] || 500) * count }))
             .sort((a, b) => b.value - a.value).slice(0, 5);
            return NextResponse.json({ success: true, data: { monthly, byType } }, { status: 200, headers });
        }

        const leads = await LeadService.getAll();
        return NextResponse.json({ success: true, data: leads }, { status: 200, headers });
    } catch (error) {
        console.error('[API /leads GET] Error:', error);
        return NextResponse.json({ success: false, error: 'Error al obtener datos.' }, { status: 500, headers });
    }
}

export async function PATCH(request: NextRequest) {
    const headers = getSecurityHeaders();

    try {
        const authHeader = request.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
        }

        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID de lead requerido.' }, { status: 400, headers });
        }

        const lead = await LeadService.update(parseInt(id), data);

        // Notify client on completion
        if (data.estado === 'completado') {
            const { EmailService } = await import('@/server/services/email.service');
            await EmailService.sendCompletionNotification(lead);
        }

        return NextResponse.json({ success: true, data: lead }, { status: 200, headers });
    } catch (error) {
        console.error('[API /leads PATCH] Error:', error);
        return NextResponse.json({ success: false, error: 'Error al actualizar lead.' }, { status: 500, headers });
    }
}

export async function DELETE(request: NextRequest) {
    const headers = getSecurityHeaders();

    try {
        const authHeader = request.headers.get('x-admin-key');
        if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400, headers });
        }

        await LeadService.delete(parseInt(id));
        return NextResponse.json({ success: true }, { status: 200, headers });
    } catch (error) {
        console.error('[API /leads DELETE] Error:', error);
        return NextResponse.json({ success: false, error: 'Error al eliminar lead.' }, { status: 500, headers });
    }
}
