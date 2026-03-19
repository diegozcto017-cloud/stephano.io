import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });
const BASE_URL = process.env.APP_URL || 'https://stephano.io';

const SYSTEM_PROMPT = (businessName: string, address: string, rating: string, reviews: string, proposalUrl: string) => `
Sos Valeria, representante de ventas de Stephano.io, agencia de desarrollo web en Costa Rica.

CLIENTE: ${businessName}${address ? ` — ${address}` : ''}${rating ? ` — ${rating} estrellas, ${reviews} reseñas en Google` : ''}
${proposalUrl ? `URL DE PROPUESTA: ${proposalUrl}` : ''}

TU OBJETIVO: Que el cliente quiera ver la propuesta o agendar una llamada con Diego.

REGLAS ESTRICTAS:
- Hablá en español de Costa Rica, cálido y natural (usá "usted" o "vos" según el tono que tome la conversación)
- Respuestas MUY CORTAS — máximo 2-3 oraciones. Es una llamada telefónica.
- Si hay interés, decí la URL: "${proposalUrl || 'stephano punto io'}"
- Si preguntan precio: "Tenemos opciones desde $500, pero depende de lo que necesiten. ¿Quiere ver la propuesta?"
- Si dicen que no tienen tiempo: "Con gusto le mando el link por WhatsApp y lo revisa cuando pueda"
- Si rechazan: agradecé y despedite con clase — no insistás
- Si dicen que ya tienen sitio web: "¡Qué bien! ¿Está contento con los resultados que le está dando?"
- Nunca menciones que sos IA. Sos Valeria.
- Nunca des discursos largos.
`.trim();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const speechResult = formData.get('SpeechResult') as string || '';
        const p = req.nextUrl.searchParams;

        const businessName = p.get('businessName') || 'el negocio';
        const address = p.get('address') || '';
        const rating = p.get('rating') || '';
        const reviews = p.get('reviews') || '0';
        const proposalUrl = p.get('proposalUrl') || '';
        const turn = parseInt(p.get('turn') || '1');
        const historyRaw = p.get('history') || '';

        // Rebuild message history
        const history: { role: 'user' | 'assistant'; content: string }[] = historyRaw
            ? JSON.parse(Buffer.from(historyRaw, 'base64').toString('utf-8'))
            : [];

        history.push({ role: 'user', content: speechResult });

        // Detect end signals
        const lowerSpeech = speechResult.toLowerCase();
        const endSignals = ['adiós', 'hasta luego', 'no gracias', 'no me interesa', 'no necesito', 'no quiero', 'cuelga', 'cortar'];
        const isEnding = endSignals.some(s => lowerSpeech.includes(s));

        let replyText: string;

        if (isEnding) {
            replyText = 'Perfecto, no hay problema. Que tenga muy buen día y cualquier consulta estamos a las órdenes. ¡Hasta luego!';
        } else {
            const { text } = await generateText({
                model: groq('llama-3.3-70b-versatile'),
                system: SYSTEM_PROMPT(businessName, address, rating, reviews, proposalUrl),
                messages: history,
                maxOutputTokens: 150,
                temperature: 0.7,
            });
            replyText = text.trim() || 'Disculpe, ¿podría repetir eso?';
        }

        history.push({ role: 'assistant', content: replyText });

        const newHistory = Buffer.from(JSON.stringify(history)).toString('base64');
        const nextParams = new URLSearchParams({
            businessName, address, rating, reviews, proposalUrl,
            history: newHistory,
            turn: String(turn + 1),
        });

        const audioUrl = `${BASE_URL}/api/calls/audio?text=${encodeURIComponent(replyText)}`;
        const actionUrl = `${BASE_URL}/api/calls/respond?${nextParams.toString()}`;

        let twiml: string;

        if (isEnding || turn >= 12) {
            twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
  <Hangup/>
</Response>`;
        } else {
            twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${actionUrl}" method="POST" speechTimeout="auto" language="es-419" timeout="8">
    <Play>${audioUrl}</Play>
  </Gather>
  <Say language="es-419" voice="Polly.Lucia">Disculpe, no escuché. Le contactamos por WhatsApp. ¡Hasta luego!</Say>
</Response>`;
        }

        return new NextResponse(twiml, {
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        });
    } catch (error) {
        console.error('[calls/respond]', error);
        const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-419" voice="Polly.Lucia">Disculpe, tuvimos un problema técnico. Le contactamos pronto. ¡Buen día!</Say>
  <Hangup/>
</Response>`;
        return new NextResponse(fallback, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
    }
}
