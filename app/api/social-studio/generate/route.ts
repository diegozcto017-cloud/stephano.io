import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SECTION_CONTEXT: Record<string, string> = {
    home: 'landing pages, e-commerce, CRM, automatización, SEO — "sistemas que atraen, convierten, escalan"',
    ecosistema: 'infraestructura digital completa: CRM, ventas, pagos, 28 industrias (restaurantes, salones, clínicas, talleres, gimnasios, hoteles, etc.)',
    cotizar: 'cotizador desde $350: landing, e-commerce, app móvil, automatización IA, auditoría empresarial',
    proceso: '5 fases: diagnóstico → arquitectura → desarrollo → automatización → lanzamiento',
    contactar: 'chatbot IA, WhatsApp, consultoría estratégica rápida',
    general: 'Stephano.io — ingeniería digital de alto rendimiento en Costa Rica',
};

export async function POST(req: NextRequest) {
    const { topic, industry = 'general', slideCount = 5, section = 'general' } = await req.json();
    const ctx = SECTION_CONTEXT[section] || SECTION_CONTEXT.general;

    const prompt = `Eres experto en contenido para Instagram de Stephano.io (agencia digital Costa Rica).
Enfoque: ${ctx}
Audiencia: negocios en ${industry}.
Tema: "${topic}"
Slides: ${slideCount}

Reglas:
- Slide 1 cover: headline impactante max 5 palabras
- Slides intermedios: una idea clara, max 8 palabras headline
- Último slide CTA: llama a acción → stephano.io
- Todo en español, corto y directo

Responde JSON objeto exacto:
{"carouselTitle":"","slides":[{"number":1,"type":"cover","headline":"","body":"","accentWord":""}],"caption":"(150-200 chars español)","hashtags":"#costarica #desarrolloweb #negociosdigitales #paginaweb #emprendimiento #tiendaonline #transformaciondigital #marketingdigital #stephanoio #negocioscr #solucionesdigitales #ecommercecr #automatizacion #crecimientodigital #tecnologia #empresas #startup #websitediseno #aplicacionesmoviles #softwareempresarial","reelHook":"(primeros 5 segundos en español)"}`;

    try {
        const key = process.env.GEMINI_API_KEY;
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 4096,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        );
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return NextResponse.json(JSON.parse(text));
    } catch {
        return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }
}
