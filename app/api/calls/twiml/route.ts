import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = (process.env.APP_URL || 'https://stephano.io').trim();

// Initial TwiML — greets prospect, starts gathering speech
export async function GET(req: NextRequest) {
    return handleTwiml(req);
}
export async function POST(req: NextRequest) {
    return handleTwiml(req);
}

function handleTwiml(req: NextRequest) {
    const p = req.nextUrl.searchParams;
    const businessName = p.get('businessName') || 'su negocio';
    const prospectName = p.get('prospectName') || '';
    const address = p.get('address') || '';
    const rating = p.get('rating') || '';
    const reviews = p.get('reviews') || '0';
    const proposalUrl = p.get('proposalUrl') || '';

    // Intro text — natural, warm, Costa Rican
    const greeting = prospectName
        ? `Buen día, ¿estoy hablando con alguien de ${businessName}?`
        : `Buen día, ¿me comunico con ${businessName}?`;

    const pitch = `Qué gusto. Mire, le llamo de Stephano punto io, somos una agencia de desarrollo web aquí en Costa Rica. Le contactamos porque notamos que ${businessName} aún no tiene sitio web${rating ? `, y con ${reviews} reseñas y ${rating} estrellas en Google, veo que tienen muy buena reputación` : ''}. Tenemos una propuesta lista especialmente para ustedes. ¿Me regalás un minutito para contarles?`;

    const introText = `${greeting} ${pitch}`;

    const respondParams = new URLSearchParams({
        businessName, prospectName, address, rating, reviews, proposalUrl,
        history: '',
        turn: '1',
    });

    const audioUrl = `${BASE_URL}/api/calls/audio?text=${encodeURIComponent(introText)}`;
    const actionUrl = `${BASE_URL}/api/calls/respond?${respondParams.toString()}`;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${actionUrl}" method="POST" speechTimeout="auto" language="es-419" timeout="10">
    <Play>${audioUrl}</Play>
  </Gather>
  <Say language="es-419" voice="Polly.Lucia">¿Hola? No escuché nada. Le dejaré un mensaje de WhatsApp. ¡Que tenga buen día!</Say>
</Response>`;

    return new NextResponse(twiml, {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    });
}
