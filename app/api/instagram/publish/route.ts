import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/server/services/instagram.service';
import { AdsService } from '@/server/services/ads.service';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const { imageUrl, caption, adId } = await req.json();

    if (!imageUrl || !caption) {
        return NextResponse.json({ success: false, error: 'imageUrl y caption son requeridos' }, { status: 400 });
    }

    const result = await InstagramService.publishPhoto(imageUrl, caption);

    if (result.success && adId) {
        // Marcar el anuncio como publicado en la DB
        await AdsService.updateAd(adId, { status: 'published', publishAt: new Date() });
    }

    return NextResponse.json(result, { status: result.success ? 200 : result.setupRequired ? 503 : 500 });
}
