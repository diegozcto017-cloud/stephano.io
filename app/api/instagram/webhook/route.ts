import { NextRequest, NextResponse } from 'next/server';
import { LeadService } from '@/server/services/lead.service';

const LEAD_KEYWORDS = [
    'cotización', 'cotizacion', 'precio', 'web', 'app', 'software',
    'automatización', 'automatizacion', 'página', 'pagina', 'tienda',
];

function containsKeyword(text: string): boolean {
    const lower = text.toLowerCase();
    return LEAD_KEYWORDS.some((kw) => lower.includes(kw));
}

// GET — Meta webhook verification
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
        console.log('[Instagram Webhook] Verification successful');
        return new NextResponse(challenge, { status: 200 });
    }

    console.warn('[Instagram Webhook] Verification failed — invalid token or mode');
    return new NextResponse('Forbidden', { status: 403 });
}

// POST — Receive Instagram events
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const entries: Array<Record<string, unknown>> = body?.entry ?? [];

        for (const entry of entries) {
            // ── DMs (messaging) ──────────────────────────────────────────
            const messaging = (entry.messaging as Array<Record<string, unknown>>) ?? [];
            for (const msg of messaging) {
                const messageObj = msg.message as Record<string, unknown> | undefined;
                const text: string = (messageObj?.text as string) ?? '';
                const senderId: string = ((msg.sender as Record<string, unknown>)?.id as string) ?? 'unknown';

                if (text && containsKeyword(text)) {
                    console.log(`[Instagram Webhook] DM keyword match from ${senderId}: "${text}"`);
                    await createLeadAndScore(senderId, text, appUrl);
                }
            }

            // ── Comments (changes) ───────────────────────────────────────
            const changes = (entry.changes as Array<Record<string, unknown>>) ?? [];
            for (const change of changes) {
                const value = change.value as Record<string, unknown> | undefined;
                const text: string = (value?.text as string) ?? '';
                const senderId: string = (value?.from as Record<string, unknown>)?.id as string ?? 'unknown';

                if (text && containsKeyword(text)) {
                    console.log(`[Instagram Webhook] Comment keyword match from ${senderId}: "${text}"`);
                    await createLeadAndScore(senderId, text, appUrl);
                }
            }
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error('[Instagram Webhook] Error processing event:', error);
        // Always return 200 to Meta so it doesn't retry endlessly
        return NextResponse.json({ ok: true }, { status: 200 });
    }
}

async function createLeadAndScore(senderId: string, messageText: string, appUrl: string) {
    try {
        const lead = await LeadService.create({
            nombre: `Instagram: ${senderId}`,
            email: `instagram_${senderId}@noreply.com`,
            tipo_proyecto: 'desarrollo_web',
            urgencia: 'media',
            mensaje: messageText,
        });

        console.log(`[Instagram Webhook] Lead created: id=${lead.id}`);

        // Auto-score the lead with Deal Intelligence
        fetch(`${appUrl}/api/deal-intelligence/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: lead.id }),
        }).catch((err) =>
            console.error('[Instagram Webhook] Auto-score error:', err)
        );

        return lead;
    } catch (error) {
        console.error('[Instagram Webhook] createLeadAndScore error:', error);
        throw error;
    }
}
