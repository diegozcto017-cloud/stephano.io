import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { handle, businessName, industry, location = 'Costa Rica', bio = '' } = await req.json();

        const name = businessName || handle?.replace('@', '') || 'este negocio';
        const industryHint = industry ? `Industria: ${industry}.` : '';
        const bioHint = bio ? `Bio de Instagram: "${bio}"` : '';

        const prompt = `Escribí un mensaje directo (DM) de Instagram en español de Costa Rica para contactar a un negocio que NO tiene sitio web.

Negocio: ${name}
${industryHint}
${bioHint}
Ubicación: ${location}

El mensaje debe:
- Empezar con un saludo natural ("¡Hola!" o similar, no "Estimados")
- Mencionar que viste su perfil de Instagram
- Plantear en 1-2 oraciones el problema que tienen sin sitio web
- Ofrecer nuestra solución de manera concisa (landing page desde $350/mes)
- Terminar con una pregunta que invite a responder
- Tono: amigable, directo, no vendedor agresivo — como un colega que recomienda algo
- Máximo 5 oraciones, sin emojis excesivos (máx 1-2)
- Sin asteriscos ni markdown, texto plano
- Firmado como: Diego | Stephano.io`;

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt,
            maxOutputTokens: 180,
            temperature: 0.7,
        });

        // Also generate a proposal hook line
        const hookPrompt = `En 1 oración directa (máx 15 palabras), generá un gancho para convencer a ${name} de ver una propuesta de sitio web. Solo la oración, sin comillas.`;

        const { text: hook } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: hookPrompt,
            maxOutputTokens: 50,
            temperature: 0.6,
        });

        return NextResponse.json({
            success: true,
            dm: text.trim(),
            hook: hook.trim(),
            handle: handle || name,
        });
    } catch (error) {
        console.error('[dm-pitch]', error);
        return NextResponse.json({ success: false, error: 'Error generando DM' }, { status: 500 });
    }
}
