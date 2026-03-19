import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs voice — multilingual female (natural Spanish)
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella — works great in Spanish

export async function GET(req: NextRequest) {
    const text = req.nextUrl.searchParams.get('text');
    if (!text) return new NextResponse('Missing text', { status: 400 });

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                method: 'POST',
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.45,
                        similarity_boost: 0.80,
                        style: 0.35,
                        use_speaker_boost: true,
                    },
                }),
            }
        );

        if (!response.ok) {
            // Fallback: redirect to Twilio TTS (no audio dependency)
            console.error('[calls/audio] ElevenLabs error:', response.status);
            return new NextResponse(null, { status: 302, headers: { Location: '/api/calls/audio-fallback' } });
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('[calls/audio]', error);
        return new NextResponse('Error generating audio', { status: 500 });
    }
}
