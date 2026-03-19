import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_API_KEY_SID!,
    process.env.TWILIO_API_KEY_SECRET!,
    { accountSid: process.env.TWILIO_ACCOUNT_SID! }
);

export async function POST(req: NextRequest) {
    try {
        const { phone, prospectName, businessName, address, rating, reviews, proposalUrl } = await req.json();

        if (!phone) return NextResponse.json({ success: false, error: 'Teléfono requerido' }, { status: 400 });

        const baseUrl = (process.env.APP_URL || 'https://stephano.io').trim();

        const params = new URLSearchParams({
            prospectName: prospectName || '',
            businessName: businessName || '',
            address: address || '',
            rating: String(rating || ''),
            reviews: String(reviews || 0),
            proposalUrl: proposalUrl || '',
        });

        const call = await client.calls.create({
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER!,
            url: `${baseUrl}/api/calls/twiml?${params.toString()}`,
            statusCallback: `${baseUrl}/api/calls/status`,
            statusCallbackMethod: 'POST',
            record: true,
        });

        return NextResponse.json({ success: true, callSid: call.sid });
    } catch (error: unknown) {
        console.error('[calls/outbound]', error);
        const msg = error instanceof Error ? error.message : 'Error al iniciar llamada';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
