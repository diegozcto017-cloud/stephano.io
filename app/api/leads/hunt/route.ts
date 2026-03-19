import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface HuntResult {
    place_id: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    types?: string[];
    hasWebsite: boolean;
    lat?: number;
    lng?: number;
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    try {
        const { query, location = 'Costa Rica', radius = 40000, noWebsiteOnly = true, lat, lng } = await req.json();

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY not configured' }, { status: 500 });
        }

        // Step 1: Text search for businesses
        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        searchUrl.searchParams.set('query', `${query} en ${location}`);
        searchUrl.searchParams.set('key', apiKey);
        searchUrl.searchParams.set('radius', String(radius));
        // Bias results to province/canton coordinates if provided
        if (lat && lng) {
            searchUrl.searchParams.set('location', `${lat},${lng}`);
        }

        const searchRes = await fetch(searchUrl.toString());
        const searchData = await searchRes.json();

        if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
            return NextResponse.json({ error: `Google API error: ${searchData.status}`, detail: searchData.error_message }, { status: 502 });
        }

        const places = searchData.results || [];

        // Step 2: Get details for each place (website, phone)
        const detailPromises = places.slice(0, 20).map(async (place: { place_id: string; name: string; formatted_address: string; rating?: number; user_ratings_total?: number; types?: string[]; geometry?: { location?: { lat: number; lng: number } } }) => {
            const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
            detailUrl.searchParams.set('place_id', place.place_id);
            detailUrl.searchParams.set('fields', 'place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry');
            detailUrl.searchParams.set('key', apiKey);

            const detailRes = await fetch(detailUrl.toString());
            const detailData = await detailRes.json();
            const d = detailData.result || {};

            return {
                place_id: d.place_id || place.place_id,
                name: d.name || place.name,
                address: d.formatted_address || place.formatted_address,
                phone: d.formatted_phone_number,
                website: d.website,
                rating: d.rating || place.rating,
                user_ratings_total: d.user_ratings_total || place.user_ratings_total,
                types: d.types || place.types,
                hasWebsite: !!d.website,
                lat: d.geometry?.location?.lat ?? place.geometry?.location?.lat,
                lng: d.geometry?.location?.lng ?? place.geometry?.location?.lng,
            } as HuntResult;
        });

        const results: HuntResult[] = await Promise.all(detailPromises);

        const filtered = noWebsiteOnly ? results.filter(r => !r.hasWebsite) : results;

        return NextResponse.json({
            total: results.length,
            noWebsite: filtered.length,
            results: filtered,
        });

    } catch (error) {
        console.error('Lead Hunt error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
