import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { businessName, address, placeId } = await req.json();

        const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
        const slug = businessName.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/gi, '').replace(/\s+/g, '');
        const zone = address?.split(',').slice(-2, -1)[0]?.trim() || 'Costa Rica';

        // Get opening hours and more from Places API
        let openingHours: string[] = [];
        let googleMapsUrl = '';
        let photos = 0;

        if (placeId) {
            const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
            detailUrl.searchParams.set('place_id', placeId);
            detailUrl.searchParams.set('fields', 'opening_hours,url,photos,formatted_phone_number');
            detailUrl.searchParams.set('key', apiKey);

            const res = await fetch(detailUrl.toString());
            const data = await res.json();
            const d = data.result || {};

            openingHours = d.opening_hours?.weekday_text || [];
            googleMapsUrl = d.url || `https://www.google.com/maps/place/?q=place_id:${placeId}`;
            photos = d.photos?.length || 0;
        }

        // Build social media search URLs (pre-built Google searches)
        const searchBase = encodeURIComponent(`${businessName} ${zone}`);
        const instagramSearch = `https://www.google.com/search?q=${searchBase}+instagram`;
        const facebookSearch = `https://www.google.com/search?q=${searchBase}+facebook`;
        const instagramGuess = `https://www.instagram.com/${slug}/`;

        // Opportunity signals
        const signals: string[] = [];
        if (openingHours.length > 0) signals.push('Horario verificado');
        if (photos > 5) signals.push(`${photos} fotos en Maps`);
        if (photos === 0) signals.push('Sin fotos — oportunidad visual');

        return NextResponse.json({
            success: true,
            openingHours,
            googleMapsUrl,
            photos,
            instagramSearch,
            facebookSearch,
            instagramGuess,
            signals,
        });
    } catch (error) {
        console.error('[leads/enrich]', error);
        return NextResponse.json({ success: false, error: 'Error enriqueciendo lead' }, { status: 500 });
    }
}
