import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PRICE_MAP: Record<string, number> = {
    'Landing Page': 350,
    'E-commerce': 1200,
    'CRM/Web App': 1500,
    'Corporativa': 450,
    'Automatización': 500,
    'Rediseño': 450,
};

const EXTRAS_MAP: Record<string, number> = {
    'Panel Admin': 500,
    'Auth': 250,
    'SEO Premium': 150,
    'Mantenimiento': 100,
};

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    try {
        const { service, clientName, clientCompany, description, timeline, extras, total } = await req.json();

        if (!service || !clientName || !description) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const basePrice = PRICE_MAP[service] ?? 350;
        const extrasArr: string[] = extras ?? [];
        const extrasBreakdown = extrasArr
            .map((e) => `- ${e}: +$${EXTRAS_MAP[e] ?? 0} USD`)
            .join('\n');

        const computedTotal = total ?? (
            basePrice + extrasArr.reduce((sum, e) => sum + (EXTRAS_MAP[e] ?? 0), 0)
        );

        const isMonthly = extrasArr.includes('Mantenimiento');
        const oneTimeTotal = computedTotal - (isMonthly ? 100 : 0);

        const prompt = `Eres el equipo de Stephano.io, agencia de desarrollo web en Costa Rica. Escribe una propuesta comercial profesional en español para el siguiente cliente. La propuesta debe tener entre 300 y 400 palabras y cubrir estos puntos en orden:

1. **Introducción personalizada** — saludo por nombre, reconocer su negocio/empresa
2. **Alcance del proyecto** — qué se va a desarrollar, basado en la descripción del cliente
3. **Entregables clave** — lista de 4-6 entregables concretos según el servicio
4. **Inversión detallada** — mostrar el desglose de precios de forma clara
5. **Proceso de trabajo** — 3 fases simples (Diseño → Desarrollo → Entrega)
6. **Próximos pasos** — CTA claro para agendar una llamada o responder por WhatsApp

Datos del cliente:
- Nombre: ${clientName}
- Empresa: ${clientCompany || 'su negocio'}
- Servicio solicitado: ${service}
- Descripción / necesidades: ${description}
- Tiempo estimado: ${timeline}
- Add-ons incluidos: ${extrasArr.length > 0 ? extrasArr.join(', ') : 'Ninguno'}

Desglose de inversión:
- ${service}: $${basePrice} USD
${extrasBreakdown}
${isMonthly ? `- Total único: $${oneTimeTotal} USD\n- Mantenimiento mensual: $100 USD/mes` : `- Total: $${computedTotal} USD`}

Tono: profesional pero cálido, confiable, orientado a resultados. Usa el nombre del cliente al inicio y al final. No uses markdown excesivo — párrafos limpios con negrita solo en secciones importantes. Firma al final como: "Diego — Stephano.io | +506 71164454"`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY!,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Anthropic error: ${err}`);
        }

        const data = await res.json();
        const proposal = data.content
            .filter((b: { type: string }) => b.type === 'text')
            .map((b: { type: string; text: string }) => b.text)
            .join('');

        return NextResponse.json({ proposal });
    } catch (error) {
        console.error('Propuesta generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al generar propuesta' },
            { status: 500 }
        );
    }
}
