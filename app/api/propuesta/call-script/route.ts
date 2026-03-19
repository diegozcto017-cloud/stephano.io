import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/server/middlewares/security';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(req: NextRequest) {
    const headers = getSecurityHeaders();
    try {
        const { businessName, address, rating, reviews, service, total } = await req.json();

        if (!businessName) {
            return NextResponse.json({ success: false, error: 'Nombre del negocio requerido.' }, { status: 400, headers });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'ANTHROPIC_API_KEY no configurada.' }, { status: 500, headers });
        }

        const fmtTotal = total ? `$${Number(total).toLocaleString('es')} USD` : '';
        const ratingInfo = rating ? ` Tienen ${rating} estrellas y ${reviews || 0} reseñas en Google Maps.` : '';

        const prompt = `Eres Diego, fundador de Stephano.io, una agencia de desarrollo web en Costa Rica. Necesitas un script de llamada telefónica para contactar a "${businessName}"${address ? `, ubicado en ${address}` : ''}.${ratingInfo} No tienen sitio web. El servicio a ofrecer es ${service || 'diseño web profesional'}${fmtTotal ? ` desde ${fmtTotal}` : ''}.

Escribe un script de llamada telefónica en español costarricense que:
- Dure máximo 45 segundos si lo lees en voz normal
- Empiece con una introducción natural (no vendedora)
- Mencione una observación específica sobre ese negocio (que no tienen web, que encontraste en Google Maps)
- Presente el beneficio concreto, no el servicio
- Termine con una pregunta de apertura que invite a conversar (no a comprar)
- Use lenguaje directo, amigable, de tico a tico
- Incluya pausas naturales marcadas con [pausa]

Formato de respuesta:
---APERTURA---
[texto del saludo]

---CUERPO---
[texto principal]

---CIERRE---
[pregunta de apertura]

---NOTAS---
[2-3 tips rápidos para la llamada: tono, qué esperar, cómo manejar objeciones comunes]`;

        const res = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 600,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const data = await res.json();

        if (data.type === 'error' || !data.content) {
            const msg = data.error?.message || 'Error en API de Anthropic';
            return NextResponse.json({ success: false, error: msg }, { status: 502, headers });
        }

        const script = data.content?.[0]?.text || '';
        return NextResponse.json({ success: true, script }, { status: 200, headers });
    } catch (error) {
        console.error('[API /propuesta/call-script]', error);
        return NextResponse.json({ success: false, error: 'Error al generar script.' }, { status: 500, headers });
    }
}
