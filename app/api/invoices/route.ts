import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSecurityHeaders } from '@/server/middlewares/security';

function authCheck(request: NextRequest) {
    const key = request.headers.get('x-admin-key');
    return process.env.ADMIN_API_KEY && key === process.env.ADMIN_API_KEY;
}

export async function GET(request: NextRequest) {
    const headers = getSecurityHeaders();
    if (!authCheck(request)) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
    }

    try {
        const statsRequested = request.nextUrl.searchParams.get('stats') === 'true';

        if (statsRequested) {
            const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });

            const now = new Date();
            const thisMonth = invoices.filter(inv => {
                const d = new Date(inv.createdAt);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });

            const total_facturado = invoices.reduce((s, i) => s + i.total, 0);
            const pagado = invoices.filter(i => i.estado_pago === 'pagado').reduce((s, i) => s + i.total, 0);
            const pendiente = invoices.filter(i => i.estado_pago === 'pendiente').reduce((s, i) => s + i.total, 0);
            const este_mes = thisMonth.reduce((s, i) => s + i.total, 0);

            // Monthly revenue last 6 months
            const monthly = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const label = d.toLocaleString('es', { month: 'short' });
                const total = invoices
                    .filter(inv => {
                        const id = new Date(inv.createdAt);
                        return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear();
                    })
                    .reduce((s, inv) => s + inv.total, 0);
                monthly.push({ label, total });
            }

            return NextResponse.json({
                success: true,
                data: { total_facturado, pagado, pendiente, este_mes, monthly, count: invoices.length },
            }, { status: 200, headers });
        }

        const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ success: true, data: invoices }, { status: 200, headers });
    } catch (error) {
        console.error('[API /invoices GET]', error);
        return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500, headers });
    }
}

export async function POST(request: NextRequest) {
    const headers = getSecurityHeaders();
    if (!authCheck(request)) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
    }

    try {
        const body = await request.json();
        const invoice = await prisma.invoice.create({
            data: {
                numero: body.numero,
                lead_id: body.lead_id || null,
                client_name: body.client_name,
                client_email: body.client_email || null,
                client_company: body.client_company || null,
                items: body.items,
                subtotal: body.subtotal,
                tax: body.tax,
                total: body.total,
                due_date: body.due_date ? new Date(body.due_date) : null,
                notes: body.notes || null,
                estado_pago: 'pendiente',
            },
        });
        return NextResponse.json({ success: true, data: invoice }, { status: 201, headers });
    } catch (error) {
        console.error('[API /invoices POST]', error);
        return NextResponse.json({ success: false, error: 'Error al guardar factura' }, { status: 500, headers });
    }
}

export async function PATCH(request: NextRequest) {
    const headers = getSecurityHeaders();
    if (!authCheck(request)) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401, headers });
    }

    try {
        const body = await request.json();
        const { id, estado_pago } = body;
        if (!id) return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400, headers });

        const invoice = await prisma.invoice.update({
            where: { id: parseInt(id) },
            data: { estado_pago },
        });
        return NextResponse.json({ success: true, data: invoice }, { status: 200, headers });
    } catch (error) {
        console.error('[API /invoices PATCH]', error);
        return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500, headers });
    }
}
