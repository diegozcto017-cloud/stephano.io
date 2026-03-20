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

type RawPlace = {
    place_id: string;
    name: string;
    formatted_address: string;
    rating?: number;
    user_ratings_total?: number;
    types?: string[];
    geometry?: { location?: { lat: number; lng: number } };
};

async function fetchAllPages(firstUrl: string, apiKey: string): Promise<RawPlace[]> {
    const all: RawPlace[] = [];

    const res1 = await fetch(firstUrl);
    const data1 = await res1.json();
    if (data1.status !== 'OK' && data1.status !== 'ZERO_RESULTS') {
        throw new Error(`Google API: ${data1.status} — ${data1.error_message || ''}`);
    }
    all.push(...(data1.results || []));

    // Page 2
    if (data1.next_page_token) {
        await new Promise(r => setTimeout(r, 2200));
        const url2 = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data1.next_page_token}&key=${apiKey}`;
        const data2 = await (await fetch(url2)).json();
        all.push(...(data2.results || []));

        // Page 3
        if (data2.next_page_token) {
            await new Promise(r => setTimeout(r, 2200));
            const url3 = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data2.next_page_token}&key=${apiKey}`;
            const data3 = await (await fetch(url3)).json();
            all.push(...(data3.results || []));
        }
    }

    return all;
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

        // ── Strategy 1: Text Search (precise query + location name) ──────────
        const textUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        textUrl.searchParams.set('query', `${query} en ${location}`);
        textUrl.searchParams.set('key', apiKey);
        if (lat && lng) {
            textUrl.searchParams.set('location', `${lat},${lng}`);
            textUrl.searchParams.set('radius', String(radius));
        }

        // ── Strategy 2: Nearby Search (coordinate-based, type-agnostic) ──────
        // Run both in parallel for the first page, merge unique results
        let allPlaces: RawPlace[] = [];

        if (lat && lng) {
            const nearbyUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
            nearbyUrl.searchParams.set('location', `${lat},${lng}`);
            nearbyUrl.searchParams.set('radius', String(Math.min(radius, 50000)));
            nearbyUrl.searchParams.set('keyword', query);
            nearbyUrl.searchParams.set('key', apiKey);

            const [textData, nearbyData] = await Promise.all([
                fetch(textUrl.toString()).then(r => r.json()),
                fetch(nearbyUrl.toString()).then(r => r.json()),
            ]);

            if (textData.status !== 'OK' && textData.status !== 'ZERO_RESULTS') {
                throw new Error(`Google Text Search: ${textData.status} — ${textData.error_message || ''}`);
            }

            // Merge unique by place_id
            const seen = new Set<string>();
            const merge = (arr: RawPlace[]) => arr.forEach(p => { if (!seen.has(p.place_id)) { seen.add(p.place_id); allPlaces.push(p); } });
            merge(textData.results || []);
            merge(nearbyData.results || []);

            // Paginate text search for up to 60 more
            if (textData.next_page_token) {
                await new Promise(r => setTimeout(r, 2200));
                const url2 = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${textData.next_page_token}&key=${apiKey}`;
                const data2 = await (await fetch(url2)).json();
                merge(data2.results || []);

                if (data2.next_page_token) {
                    await new Promise(r => setTimeout(r, 2200));
                    const url3 = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data2.next_page_token}&key=${apiKey}`;
                    const data3 = await (await fetch(url3)).json();
                    merge(data3.results || []);
                }
            }

            // Paginate nearby search too
            if (nearbyData.next_page_token) {
                await new Promise(r => setTimeout(r, 2200));
                const nurl2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nearbyData.next_page_token}&key=${apiKey}`;
                const nd2 = await (await fetch(nurl2)).json();
                merge(nd2.results || []);
            }
        } else {
            // No coords → paginate text search only
            allPlaces = await fetchAllPages(textUrl.toString(), apiKey);
        }

        // Sort by popularity, take top 40 for detail calls
        const topPlaces = allPlaces
            .sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0))
            .slice(0, 40);

        // Get details (website + phone) in batches of 10 to avoid rate limits
        const detailPromises = topPlaces.map(async (place) => {
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
        const msg = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
