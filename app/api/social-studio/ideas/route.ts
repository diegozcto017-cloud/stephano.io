import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SECTION_CONTEXT: Record<string, string> = {
    home: 'landing pages, e-commerce, CRM, automatización, SEO — "sistemas que atraen, convierten, escalan"',
    ecosistema: 'infraestructura digital completa: CRM, ventas, pagos, integraciones — 28 industrias (restaurantes, salones, clínicas, talleres, ferreterías, gimnasios, academias, hoteles)',
    cotizar: 'cotizador interactivo desde $350: landing, e-commerce, app, automatización IA, auditoría',
    proceso: '5 fases: diagnóstico → arquitectura → desarrollo → automatización → lanzamiento',
    contactar: 'chatbot IA, WhatsApp +506 7116-4454, consultoría estratégica',
    general: 'agencia de ingeniería digital en Costa Rica — web, apps, CRM, automatización',
};

export async function POST(req: NextRequest) {
    const { industry = 'general', section = 'general' } = await req.json();
    const ctx = SECTION_CONTEXT[section] || SECTION_CONTEXT.general;

    const prompt = `Eres estratega de redes para Stephano.io (agencia digital Costa Rica).
Sección del sitio: ${ctx}
Audiencia: negocios en ${industry === 'general' ? 'Costa Rica' : industry}.

Genera 8 ideas de Instagram. Distribución: 6 ideas category "70" (probadas), 1 category "20" (variación ganadora), 1 category "10" (experimental).
Pilares: educativo (40%), entretenido (30%), emocional (30%).

Responde JSON array, 8 objetos exactos:
[{"id":"","title":"(max 8 palabras)","hook":"(frase gancho)","angle":"pain-point","format":"carousel","slides":5,"industry":"${industry}","viralScore":85,"why":"(max 12 palabras)","category":"70","pillar":"educativo"}]

angle: pain-point|education|before-after|social-proof|showcase
format: carousel|reel|single
category: "70"|"20"|"10"
pillar: educativo|entretenido|emocional
Todo en español.`;

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
                        temperature: 0.9,
                        maxOutputTokens: 4096,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        );
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const ideas = JSON.parse(text);
        return NextResponse.json({ ideas: Array.isArray(ideas) ? ideas : [] });
    } catch {
        return NextResponse.json({ ideas: [] });
    }
}
